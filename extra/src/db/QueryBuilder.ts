import { DbState, DbQuery, IQueryable } from './types';
import { runQuery } from './runQuery';
import { SortDirection } from '@epam/uui-core';

export class QueryBuilder<T = any> implements IQueryable<T> {
    constructor(private db: DbState, private query: DbQuery) {}
    private clone(): this {
        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        clone.query = { ...this.query };
        return clone;
    }

    public find(pattern: Partial<T>): QueryBuilder<T> {
        const clone = this.clone();
        clone.query.pattern = { ...this.query.pattern, ...pattern };
        return clone;
    }

    public byId(...id: any[]): T {
        /* Broken implementation. person.find({ isDeleted: false }).byId('123') will return person with ID = 123, even if it is deleted.
        At the other hand, this method should be very fast, and it's hard to make it fast with current API design.
        */
        const key = this.db.schema.entitySchemas[this.query.entityName].argsToKey(id);
        return this.db.entities[this.query.entityName].byKey.get(key);
    }

    public range(from: number, count: number): T[] {
        return runQuery(this.db, {
            ...this.query,
            range: { from, count },
        });
    }

    public count() {
        return runQuery(this.db, this.query).length; // super-naive, but cache can help
    }

    public one(): T {
        const result = runQuery(this.db, { ...this.query, range: { from: 0, count: 1 } });
        return result[0] as T;
    }

    public toArray(): T[] {
        return runQuery(this.db, this.query);
    }

    public orderBy(name: Extract<keyof T, string>, dir?: SortDirection) {
        const clone = this.clone();
        clone.query.order = [{ name, dir: dir || 'asc' }];
        return clone;
    }

    public thenBy(name: Extract<keyof T, string>, dir?: SortDirection) {
        const clone = this.clone();
        clone.query.order = [...(clone.query.order || []), { name: name, dir: dir || 'asc' }];
        return clone;
    }
}
