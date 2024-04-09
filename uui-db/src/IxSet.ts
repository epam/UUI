import BTree from 'sorted-btree';
import { DbQuery } from './types';
import {
    DataQueryFilterCondition, DataQueryFilter, getFilterPredicate, orderBy,
} from '@epam/uui-core';

export interface IxSetIndexDefinition<TEntity> {
    fields: (keyof TEntity)[];
}

const ID = Symbol('ID');

type IndexKey<TEntity> = TEntity & { [ID]: any };

export interface IxSetIndex<TEntity> extends IxSetIndexDefinition<TEntity> {
    tree: BTree<IndexKey<TEntity>, void>;
    compare: (a: IndexKey<TEntity>, b: IndexKey<TEntity>) => number;
}

// Filter condition types
enum FilterConditionType {
    Single = 1,
    Multi = 2
}

function defaultComparator(a: any, b: any) {
    if (a === null) return -1;
    if (b === null) return 1;
    if (a === -Infinity || b === Infinity) return -1;
    if (b === Infinity || a === -Infinity) return 1;

    return a < b ? -1 : a > b ? 1 : 0;
}

function iterator<T>(next: () => { done: boolean; value?: T } = () => ({ done: true, value: undefined })): IterableIterator<T> {
    const result: any = { next };
    result[Symbol.iterator] = function () {
        return this;
    };
    return result;
}

export class IxSet<TEntity, TId> {
    empty: BTree<TId, TEntity>;
    /** Primary key - a b-tree with entity ID as a key, and entity itself as a value */
    pk: BTree<TId, TEntity>;
    indexes: IxSetIndex<TEntity>[];
    constructor(private getId: (e: Partial<TEntity>) => TId, indexesDefinition: IxSetIndexDefinition<TEntity>[]) {
        this.empty = new BTree([]);
        this.pk = this.empty;
        this.indexes = indexesDefinition.map((definition) => {
            const fields = definition.fields;
            const compare = (a: IndexKey<TEntity>, b: IndexKey<TEntity>) => {
                if (a === b) return 0;
                if (a == null) return -1;
                if (b == null) return 1;

                for (let i = 0; i < fields.length; i++) {
                    const field = fields[i];
                    const result = defaultComparator(a[field], b[field]);
                    if (result !== 0) {
                        return result;
                    }
                }

                return defaultComparator(a[ID], b[ID]);
            };

            return {
                ...definition,
                compare,
                tree: new BTree<IndexKey<TEntity>>([], compare),
            };
        });
    }

    public clone() {
        const blank = Object.create(IxSet.prototype) as IxSet<TEntity, TId>;
        blank.empty = this.empty;
        blank.getId = this.getId;
        blank.pk = this.pk;
        blank.indexes = this.indexes;
        return blank;
    }

    public byId(id: TId): TEntity {
        return this.pk.get(id);
    }

    public with(items: Partial<TEntity>[]): IxSet<TEntity, TId> {
        const newSet = this.clone();
        newSet.pk = this.pk.clone();

        const updatedFields = {} as any;

        const updates = items.map((patch) => {
            const id = this.getId(patch);
            const existing = this.pk.get(id);
            let updated = patch as TEntity;
            if (existing) {
                updated = { ...existing, ...patch };
            }
            const existingIndexEntry = { ...existing, [ID]: id };
            const updatedIndexEntry = { ...updated, [ID]: id };
            Object.keys(patch).forEach((f) => {
                updatedFields[f] = true;
            });
            return {
                id, patch, existing, updated, existingIndexEntry, updatedIndexEntry,
            };
        });

        updates.forEach((update) => newSet.pk.set(update.id, update.updated));

        newSet.indexes = this.indexes.map((existingIndex) => {
            if (existingIndex.fields.some((f) => updatedFields[f])) {
                const newIndex = { ...existingIndex };
                newIndex.tree = existingIndex.tree.clone();

                const keysToRemove = updates.filter((u) => !!u.existing).map((u) => u.existingIndexEntry);
                keysToRemove.sort(existingIndex.compare);
                newIndex.tree.deleteKeys(keysToRemove);

                const keysToAdd = updates.map((u) => u.updatedIndexEntry);
                keysToAdd.sort(existingIndex.compare);
                keysToAdd.forEach((key) => newIndex.tree.set(key));

                return newIndex;
            } else {
                return existingIndex;
            }
        });

        return newSet;
    }

    public query(query: DbQuery<TEntity>) {
        const filter: DataQueryFilter<TEntity> = query.filter || {};
        const filterFields = Object.keys(filter) as (keyof TEntity)[];
        const filterFieldTypes = {} as Record<keyof TEntity, FilterConditionType>;
        filterFields.forEach((f) => {
            const condition = filter[f] as DataQueryFilterCondition<any>;
            if (condition != null && typeof condition === 'object') {
                if (condition.in) {
                    filterFieldTypes[f] = FilterConditionType.Multi;
                }
            } else {
                filterFieldTypes[f] = FilterConditionType.Single;
            }
        });

        let plans = this.indexes
            .map((index) => {
                if (filterFieldTypes[index.fields[0]]) {
                    let matchCount = 0;
                    const from: IndexKey<TEntity> = { [ID]: -Infinity } as any;
                    const to: IndexKey<TEntity> = { [ID]: +Infinity } as any;
                    const lookupFields = {} as Record<keyof TEntity, boolean>;
                    let isRemainingUnused = false;

                    for (let i = 0; i < index.fields.length; i++) {
                        const field: keyof TEntity = index.fields[i];
                        if (!isRemainingUnused && filterFieldTypes[field] === FilterConditionType.Single) {
                            lookupFields[field] = true;
                            from[field] = filter[field] as any;
                            to[field] = filter[field] as any;
                            matchCount++;
                        } else {
                            isRemainingUnused = true;
                            from[field] = -Infinity as any;
                            to[field] = Infinity as any;
                        }
                    }

                    let remainingFilter: DataQueryFilter<TEntity> = null;
                    filterFields
                        .filter((f) => !lookupFields[f])
                        .forEach((f) => {
                            if (!remainingFilter) {
                                remainingFilter = {};
                            }
                            remainingFilter[f] = filter[f];
                        });

                    const score = matchCount;
                    if (matchCount > 0) {
                        return {
                            score, index, from, to, remainingFilter,
                        };
                    }
                }

                return null;
            })
            .filter((p) => p != null);

        plans = orderBy(plans, (plan) => plan.score, 'desc');
        const plan = plans[0];

        // const indexEntities = plan.index.tree.entries();

        let treeIterator: IterableIterator<TEntity>;

        if (plan) {
            const indexIterator = plan.index.tree.entries(plan.from);
            treeIterator = iterator(() => {
                const next = indexIterator.next() as any;
                if (!next.value) {
                    return next;
                }
                next.value = next.value[0];
                if (plan.index.compare(next.value, plan.to) > 0) {
                    next.done = true;
                    next.value = null;
                    return next;
                }
                next.value = this.pk.get(next.value[ID]);
                return next;
            });
        } else {
            treeIterator = this.pk.values();
        }

        const result: TEntity[] = [];

        const filterPredicate = getFilterPredicate(plan ? plan.remainingFilter : filter);

        let current;
        let index = 0;
        let count = 0;
        const rangeFrom = (query.range && query.range.from) || 0;
        const rangeCount = (query.range && query.range.count) || Number.MAX_SAFE_INTEGER;
        while (!(current = treeIterator.next()).done && count < rangeCount) {
            const entity: TEntity = current.value;
            const passedFilter = !filterPredicate || filterPredicate(entity);

            if (passedFilter && index >= rangeFrom) {
                result.push(entity);
                count++;
            }
            index++;
        }

        return result;
    }

    public queryOne(query: DbQuery<TEntity>) {
        return this.query(query)[0];
    }
}
