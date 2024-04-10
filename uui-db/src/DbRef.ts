import { Db } from './Db';
import {
    DbPatch, DbTablesSet, DbSaveResponse, DbView, DbSubscription,
} from './types';
import {
    makeCumulativePatch, unionPatches, mergeEntityPatches, flattenResponse,
} from './patchHelpers';
import { TempIdMap, IClientIdsMap } from './tempIds';
import { objectKeys } from './utils';
import isEmpty from 'lodash.isempty';
import { Loader, LoaderOptions } from './Loader';
import { DataQuery } from '@epam/uui-core';
import { SimpleLoadingTracker } from './SimpleLoadingTracker';
import { ListLoadingTracker, ListLoadingTrackerOptions } from './ListLoadingTracker';
import { batch } from './batch';

export class DbRef<TTables extends DbTablesSet<TTables>, TDb extends Db<TTables>> {
    private base: TDb;
    private log: { patch: DbPatch<TTables> }[] = [];
    private autoSave = true;
    private savedPoint = 0;
    private tempIdMap: TempIdMap<TTables>;
    public db: TDb;
    protected throttleSaveMs = 1000;
    public readonly idMap: IClientIdsMap;
    constructor(public blank: TDb) {
        this.db = blank;
        this.base = blank;
        this.tempIdMap = new TempIdMap(blank);
        this.idMap = this.tempIdMap;

        window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    /** Saves all committed patches. Useful only if autoSave is off. */
    public save() {
        return this.enqueueSave();
    }

    public getAutoSave() {
        return this.autoSave;
    }

    public setAutoSave(val: boolean) {
        if (this.autoSave != val) {
            this.autoSave = val;
            this.autoSave && this.enqueueSave();
            this.update();
        }
    }

    public revert() {
        this.db = this.base;
        this.log = this.log.slice(0, this.savedPoint);
        this.update();
    }

    /** Concrete DbRef instances should override and implement their save logic in this method */
    protected savePatch(patch: DbPatch<TTables>): Promise<DbSaveResponse<TTables>> {
        return Promise.resolve({ submit: {} });
    }

    /* Db Update logic */

    public commit(patch: DbPatch<TTables>): void {
        const dbBeforeUpdate = this.db.with(patch);
        patch = this.beforeUpdate(patch, dbBeforeUpdate.tables, this.db.tables);
        patch = mergeEntityPatches(this.db.tables, patch);
        this.log.push({ patch });
        this.db = this.db.with(patch);

        this.autoSave && this.enqueueSave(null, { throttleMs: this.throttleSaveMs });
        this.update();
    }

    private beforeUpdate(patch: DbPatch<TTables>, tables: TTables, prevTables: TTables): DbPatch<TTables> {
        let patchAndDependencies: DbPatch<TTables> = {};

        objectKeys(tables)
            .filter((entityName) => patch[entityName] && !tables[entityName].schema.beforeUpdate)
            .forEach((entityName) => {
                patchAndDependencies[entityName] = patch[entityName];
            });

        objectKeys(tables)
            .filter((entityName) => patch[entityName] && tables[entityName].schema.beforeUpdate)
            .forEach((entityName) => {
                const schema = tables[entityName].schema;
                const { beforeUpdate } = schema;
                const context = {
                    clientIdsMap: this.tempIdMap,
                    schema,
                    tables,
                    prevTables,
                };

                const results = patch[entityName].map((e) => beforeUpdate(e, context));
                const updatedPatch = { [entityName]: results.map((result) => result.entity) } as DbPatch<TTables>;
                const dependentEntityPatchesForUpdate = unionPatches(results.filter((result) => result.dependentEntities).map((result) => result.dependentEntities));
                const dependentEntityPatches = this.beforeUpdate(dependentEntityPatchesForUpdate, tables, prevTables);

                patchAndDependencies = mergeEntityPatches(tables, unionPatches([
                    patchAndDependencies, updatedPatch, dependentEntityPatches,
                ]));
            });
        return patchAndDependencies;
    }

    public commitFetch(patch: DbPatch<TTables>): void {
        patch = this.tempIdMap.serverToClientPatch(patch);
        this.rebase(this.base.with(patch));
        this.update();
    }

    private rebase(newBase: TDb) {
        this.base = newBase;
        this.db = newBase;
        for (let n = this.savedPoint; n < this.log.length; n++) {
            this.db = this.db.with(this.log[n].patch);
        }
    }

    private makeCumulativePatch() {
        const lastLogEntry = this.log.length;
        const logEntriesToSave = this.log.slice(this.savedPoint, lastLogEntry);
        let cumulativePatch = makeCumulativePatch(
            this.db,
            logEntriesToSave.map((t) => t.patch),
            this.tempIdMap,
        );
        cumulativePatch = this.tempIdMap.clientToServerPatch(cumulativePatch);

        return cumulativePatch;
    }

    private applyResponse(response: DbSaveResponse<TTables>, newSavedPoint: number) {
        this.tempIdMap.appendServerMapping(response);

        let serverPatch = flattenResponse(response.submit, this.db.tables);
        serverPatch = mergeEntityPatches(this.db.tables, serverPatch);
        this.savedPoint = newSavedPoint;
        this.base = this.db;
        this.commitFetch(serverPatch);
    }

    /* Update subscriptions (aka live views) */

    private lastSubscriptionId = 1;
    private subscriptions: Map<number, DbSubscription<any, any>> = new Map();
    public subscribe<TValue, TParams, TDependencies>(
        view: DbView<TDb, TValue, TParams, TDependencies>,
        params: TParams,
        onUpdate: (newValue: TValue) => any,
    ): DbSubscription<TValue, TParams> {
        const id = this.lastSubscriptionId++;

        const subscription: DbSubscription<TValue, TParams> = {
            update: (subscriptionParams: TParams) => {
                subscription.currentParams = subscriptionParams;
                subscription.currentValue = this.db.runView(view, subscriptionParams);
                return subscription.currentValue;
            },
            currentParams: null,
            currentValue: null,
            onUpdate,
            unsubscribe: () => {
                this.subscriptions.delete(id);
            },
        };

        subscription.update(params);

        this.subscriptions.set(id, subscription);

        return subscription;
    }

    updateHandlers: (() => any)[] = [];
    public onUpdate(handler: () => any) {
        this.subscribe(
            {
                compute: (db) => db,
                compareResults: (a, b) => a === b,
            },
            null,
            handler,
        );
    }

    private update() {
        this.subscriptions.forEach((subscription) => {
            const previousValue = subscription.currentValue;
            subscription.update(subscription.currentParams);
            if (subscription.currentValue !== previousValue && subscription.onUpdate) {
                subscription.onUpdate(subscription.currentValue);
            }
        });
    }

    /* Error Subscriptions */

    public saveErrorHandlers: ((request: DbPatch<TTables>, error: any) => void)[] = [];
    public onSaveError(handler: (request: DbPatch<TTables>, error: any) => void) {
        this.saveErrorHandlers.push(handler);
    }

    private saveError(request: DbPatch<TTables>, error: any) {
        this.saveErrorHandlers.forEach((handler) => handler(request, error));
    }

    /* Save scheduling */

    private enqueueSave = batch(async () => {
        const cumulativePatch = this.makeCumulativePatch();
        const lastLogEntry = this.log.length;
        if (isEmpty(cumulativePatch)) {
            return;
        }
        try {
            const response = await this.savePatch(cumulativePatch);
            this.applyResponse(response, lastLogEntry);
            this.update();
        } catch (error) {
            this.saveError(cumulativePatch, error);
            this.update();
            throw error;
        }
    });

    private handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (this.enqueueSave.isBusy) {
            e.returnValue = false;
            return false;
        }
    };

    loaders: Loader<TTables, any, any>[] = [];
    protected makeLoader<TResponse, TRequest>(options: LoaderOptions<TTables, TResponse, TRequest>) {
        const loader = new Loader<TTables, TResponse, TRequest>(this as any, () => new SimpleLoadingTracker<TRequest, TResponse>(), options);
        this.loaders.push(loader);
        return loader;
    }

    protected makeListLoader<TItem, TResponse = DataQuery<TItem>, TRequest extends DataQuery<TItem> = DataQuery<TItem>>(
        options: LoaderOptions<TTables, TResponse, TRequest> & ListLoadingTrackerOptions<TItem, TResponse>,
    ) {
        const loader = new Loader<TTables, TResponse, TRequest>(this as any, () => new ListLoadingTracker<TItem, TRequest, TResponse>(), options);
        this.loaders.push(loader);
        return loader;
    }

    reload() {
        this.loaders = [];
    }
}
