import {
    DbPatch, DbTablesSet, DbTableEntityByTable, DbView, DbRelationType, ViewCacheItem,
} from './types';
import { objectKeys, defaultCompareViewDependencies, difference } from './utils';
import isEqual from 'fast-deep-equal';

type ViewCache = Map<DbView<any, any, any, any>, Map<string, ViewCacheItem>>;

export abstract class Db<TTables extends DbTablesSet<TTables>> {
    private viewCache: ViewCache = new Map();
    constructor(public tables: TTables, reusedCache?: ViewCache) {
        if (reusedCache) {
            this.viewCache = new Map(reusedCache);
        } else {
            this.viewCache = new Map();
        }
    }

    private update(mutate: (db: this) => void): this {
        const clone = new (this.constructor as any)(this.tables, this.viewCache);
        clone.tables = { ...this.tables };
        mutate(clone);
        return clone;
    }

    public with(patch: DbPatch<TTables>): this {
        return this.update((db) => {
            objectKeys(db.tables).forEach((entityName) => {
                if (patch[entityName]) {
                    db.tables[entityName] = db.tables[entityName].with(patch[entityName]);
                }
            });
        });
    }

    /* Views (cached db projections) */

    valueAbsent = Symbol('ValueAbsent');
    public runView<TResult, TParams = void, TDependencies = void>(view: DbView<this, TResult, TParams, TDependencies>, params?: TParams) {
        let cache = this.viewCache.get(view);

        if (!cache) {
            cache = new Map();
            this.viewCache.set(view, cache);
        }

        const key = view.getKey ? view.getKey(params) : JSON.stringify(params);

        let cacheItem: ViewCacheItem = cache.get(key);

        if (!cacheItem) {
            cacheItem = {
                dependencies: this.valueAbsent,
                currentValue: this.valueAbsent,
                computedOnDb: this.valueAbsent,
            };
            cache.set(key, cacheItem);
        }

        let shouldUpdate = this !== cacheItem.computedOnDb;
        let dependencies: any = this.valueAbsent;

        if (view.getDependencies) {
            const compare = view.compareDependencies || defaultCompareViewDependencies;
            dependencies = view.getDependencies(this, params);
            shouldUpdate = !compare(cacheItem.dependencies, dependencies);
        }

        const previousValue = cacheItem.currentValue;

        if (shouldUpdate) {
            cacheItem.dependencies = dependencies;
            const newValue = view.compute(this, params, dependencies);
            cacheItem.computedOnDb = this;

            const compareResults = view.compareResults || isEqual;

            if (!compareResults(previousValue, newValue)) {
                if (view.traceDiff) {
                    console.debug(difference(previousValue, newValue));
                }

                cacheItem.currentValue = newValue;
            }
        }

        return cacheItem.currentValue as TResult;
    }
}
