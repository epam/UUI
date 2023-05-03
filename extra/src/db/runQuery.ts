import {
    DbQuery, DbState, EntityState, ColumnOrder,
} from './types';
import * as I from 'immutable';

export const runQuery = runQueryNaive;

const runFilterSortNaive = cached((p) => {
    const { entityName, order, pattern } = p;
    return JSON.stringify({ entityName, order, pattern });
}, runFilterSortNaiveImpl);

function runFilterSortNaiveImpl(db: DbState, q: DbQuery): any[] {
    const e = db.entities[q.entityName];
    let result: I.Iterable<any, any> = db.entities[q.entityName].byKey;

    result = runFilterNaive(q, result);

    result = runSortNaive(q, result);

    return result.toArray();
}

function runFilterNaive(q: DbQuery, result: I.Iterable<any, any>) {
    if (q.pattern) {
        result = result.filter((e) => Object.keys(q.pattern).every((key) => e[key] == (q.pattern as any)[key]));
    }
    return result;
}

function runSortNaive(q: DbQuery, result: I.Iterable<any, any>) {
    if (q.order) {
        if (q.order.length > 0) {
            const comparer = (a: any, b: any) => {
                for (let n = 0; n < q.order.length; n++) {
                    const fieldName = q.order[n].name;
                    if (a[fieldName] != b[fieldName]) {
                        const cmp = a[fieldName] < b[fieldName] ? -1 : 1;
                        return q.order[n].dir == 'asc' ? cmp : -cmp;
                    }
                }
                return 0;
            };
            result = result.sort(comparer);
        }
    }
    return result;
}

function runQueryNaive(db: DbState, q: DbQuery) {
    let result = runFilterSortNaive(db, q);

    if (q.range) {
        result = result.slice(q.range.from, q.range.from + q.range.count);
    }

    return result;
}

const disableCache = false;

function withCache<T>(db: DbState, key: string, create: () => T) {
    const fromCache = db.cache[key];
    if (!disableCache && fromCache) {
        return fromCache;
    } else {
        const result = create();
        db.cache[key] = result;
        return result;
    }
}

function cached<Params, Result>(getKey: (p: Params) => string, fn: (db: DbState, p: Params) => Result): (db: DbState, p: Params) => Result {
    return function (db: DbState, p: Params) {
        const key = getKey(p);
        return withCache(db, key, () => fn(db, p));
    };
}
