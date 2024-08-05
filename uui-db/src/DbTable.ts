import {
    DbTablePatch, DbQuery, DbEntitySchema, DbPkFieldType, DbTablesSet,
} from './types';
import * as I from 'immutable';
import {
    SortDirection, getFilterPredicate, getOrderComparer, DataQueryFilter, SortingOption, getSearchFilter, DataQuery,
} from '@epam/uui-core';
import { Seq } from 'immutable';

interface DbIndex<TEntity> {
    field: keyof TEntity;
    map: I.Map<any, I.Set<any>>;
}

interface DbTableState<TEntity, TTables extends DbTablesSet<TTables>> {
    pk: I.Map<any, TEntity>;
    indexes: DbIndex<TEntity>[];
}

export class DbTable<TEntity, TId extends DbPkFieldType, TTables extends DbTablesSet<TTables>> {
    constructor(public readonly schema: DbEntitySchema<TEntity, TId, TTables>, private state?: DbTableState<TEntity, TTables>, private q?: DbQuery<TEntity>) {
        if (!state) {
            const indexes: DbIndex<TEntity>[] = (schema.indexes || []).map((indexDef) => {
                return {
                    field: indexDef,
                    map: I.Map(),
                };
            });

            this.state = { pk: I.Map(), indexes };
        }

        if (!q) {
            this.q = {};
        }
    }

    protected keyToImmutable(id: TId): any {
        if (Array.isArray(id)) {
            return I.List(id);
        } else {
            return id;
        }
    }

    public byId(id: TId): TEntity {
        return this.state.pk.get(this.keyToImmutable(id));
    }

    public getId(entity: Partial<TEntity>): TId {
        if (Array.isArray(this.schema.primaryKey)) {
            return this.schema.primaryKey.map((key: keyof TEntity) => entity[key]) as any as TId;
        }
        return entity[this.schema.primaryKey as keyof TEntity] as any as TId;
    }

    private update(mutate: (t: DbTable<TEntity, TId, TTables>) => void): this {
        const clone = new (this.constructor as any)(this.schema, this.state, this.q);
        mutate(clone);
        return clone;
    }

    /* Mutation */

    public with(patch: DbTablePatch<TEntity>) {
        const updates = patch.map((entityPatch) => {
            const id = this.getId(entityPatch);
            const immId = this.keyToImmutable(id);
            const existing = this.state.pk.get(immId);
            let isDeleted = false;
            let updated = entityPatch as TEntity;
            if (existing) {
                updated = { ...existing, ...entityPatch };

                if (this.schema.deleteFlag) {
                    isDeleted = (updated[this.schema.deleteFlag] as unknown) === true;
                }
            }

            return {
                id, immId, patch: entityPatch, existing, updated, isNew: !existing, isDeleted,
            };
        });

        const idVal = Seq.Keyed<TId, TEntity>(updates.map((entity) => [entity.immId, entity.updated]));
        let newPk = this.state.pk.merge(idVal);

        // TBD: replace with deleteAll after migrating to immutable 4
        updates
            .filter((u) => u.isDeleted)
            .forEach((u) => {
                newPk = newPk.delete(u.immId);
            });

        const newIndexes = this.state.indexes.map((index) => {
            let newMap = index.map;

            for (let n = 0; n < updates.length; n++) {
                const update = updates[n];

                const newKey = update.updated[index.field];

                if (update.existing) {
                    const oldKey = update.existing[index.field];

                    if (oldKey !== newKey || update.isDeleted) {
                        newMap = newMap.update(oldKey, (set) => set.remove(update.immId));
                    }
                }

                if (!update.isDeleted) {
                    newMap = newMap.update(newKey, I.Set(), (set) => set.add(update.immId));
                }
            }

            return { ...index, map: newMap };
        });

        const newState: DbTableState<TEntity, TTables> = { pk: newPk, indexes: newIndexes };

        return this.update((t) => (t.state = newState));
    }

    /* Query */

    public find(filter: DataQueryFilter<TEntity>): DbTable<TEntity, TId, TTables> {
        return this.update((t) => (t.q = { ...t.q, filter: { ...(this.q.filter as any), ...(filter as any) } }));
    }

    public order(order: SortingOption[]) {
        return this.update((t) => (t.q = { ...t.q, sorting: order }));
    }

    public orderBy(field: Extract<keyof TEntity, string>, direction: SortDirection = 'asc') {
        return this.update((t) => (t.q = { ...t.q, sorting: [{ field, direction }] }));
    }

    public thenBy(field: Extract<keyof TEntity, string>, direction?: SortDirection) {
        return this.update((t) => (t.q = { ...t.q, sorting: [...t.q.sorting, { field, direction }] }));
    }

    public search(text: string) {
        if (!this.schema.searchBy) {
            throw new Error(`Can't search in the ${this.schema.typeName} table - searchBy is not defined in the schema.`);
        }
        return this.update((t) => (t.q = { ...t.q, search: text }));
    }

    /* Materializing */

    public range(from: number, count: number): TEntity[] {
        return this.runQuery({ ...this.q, range: { from, count } });
    }

    public count() {
        return this.runQuery(this.q).length;
    }

    public one(): TEntity {
        return this.runQuery(this.q)[0] || null;
    }

    public toArray(): TEntity[] {
        return this.runQuery(this.q);
    }

    public map<T>(fn: (item: TEntity, index?: number) => T) {
        return this.toArray().map(fn);
    }

    /* Query implementation */

    private runQuery(q: DataQuery<TEntity>) {
        let result: TEntity[] = null;
        let filter = q.filter;

        if (filter) {
            const indexes = this.state.indexes;

            // Try to use indexes to fulfill filter conditions
            for (let n = 0; n < indexes.length; n++) {
                const index = indexes[n];

                if (index.field in filter) {
                    const { [index.field]: condition, ...rest } = filter as any;
                    let conditionValues: any[] = null;

                    if (condition != null && typeof condition === 'object') {
                        // Attempt to use index for 'in' and 'isNull' criteria.
                        // We need to be very conservative here, indexed field should work the same way as getPatternPredicate. So
                        // - it's better to leave corner cases to getPatternPredicate

                        const { in: inCriteria, isNull: nullCriteria, ...restCriteria } = condition as any;
                        if (inCriteria && Array.isArray(inCriteria)) {
                            conditionValues = inCriteria;
                        } else {
                            restCriteria.in = inCriteria;
                        }

                        // Conditions in getPatternPredicate are composed with 'and' logic,
                        // For now, let's not attempt to handle tricky cases like { in: [1,2] isNull: true }, or { in: [1, null] isNull: false }
                        // - just leave this to getPatternPredicate.
                        // Let's just handle the a most common case { isNull: true } - find all null and undefined
                        if (nullCriteria === true && !conditionValues) {
                            conditionValues = [null, undefined];
                        } else {
                            restCriteria.in = inCriteria;
                        }

                        // Keep other conditions, e.g. { in: [1,2,3], isNull: true } - in works via index, isNull - via filter
                        if (Object.keys(restCriteria).length > 0) {
                            rest[index.field] = restCriteria;
                        }
                    } else {
                        conditionValues = [condition];
                    }

                    if (conditionValues) {
                        result = [];

                        for (let i = 0; i < conditionValues.length; i++) {
                            const idsSet = index.map.get(conditionValues[i]);
                            if (idsSet) {
                                const idsArray = idsSet.toArray();
                                for (let j = 0; j < idsArray.length; j++) {
                                    const item = this.state.pk.get(idsArray[j]);
                                    result.push(item);
                                }
                            }
                        }

                        filter = Object.keys(rest).length > 0 ? (rest as any) : null;
                        break;
                    }
                }
            }
        }

        if (!result) {
            result = this.state.pk.toArray();
        }

        if (filter) {
            const predicate = getFilterPredicate<TEntity>(q.filter);
            result = result.filter(predicate);
        }

        if (q.search) {
            const searchFilter = getSearchFilter(q.search);
            result = result.filter((item) => searchFilter(this.schema.searchBy.map((field) => (item as any)[field])));
        }

        if (q.sorting) {
            const comparer = getOrderComparer({ sorting: q.sorting, getId: this.getId });
            result = result.sort(comparer);
        }

        if (q.range) {
            result = result.slice(q.range.from, q.range.from + q.range.count);
        }

        return result;
    }
}
