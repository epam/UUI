import { Db } from './types';
import { DbPatch } from './types';
import { DbSchema, DbEntitySchema } from './DbSchema';
import { DbEntityLens } from './DbLenses';
import * as I from 'immutable';
import { objectKeys } from './helpers';

export interface DbSaveRequest<T> {
    patch: DbPatch<T>;
}

export interface ServerError {
    message?: string;
}

export interface DbSaveResponse<T> {
    patch?: DbPatch<T>;
    clientIdsMapping?: Record<string, number>;
    validationErrors?: ServerError[];
}

export interface DbRefStatus {
    isLoading: boolean;
    hasPendingChanges: boolean;
    isInvalid: boolean;
    errors: ServerError[];
}

export class DbRef<T> {
    blank: Db<T>;
    base: Db<T>;
    current: Db<T>;
    log: { patch: DbPatch<T> }[] = [];
    savedPoint = 0;
    autoSave = false;
    throttleSaveMs = 1000;
    lastTempId = -1;
    tempIdToId: I.Map<number, any> = I.Map();
    errors: ServerError[] = [];
    constructor(private schema: DbSchema<T>, private onUpdate: () => void = () => {}) {
        this.blank = schema.newDb();
        this.base = this.blank;
        this.current = this.blank;
        this.log = [];
    }

    public getStatus(): DbRefStatus {
        return {
            isLoading: this.isSaveInProgress,
            hasPendingChanges: this.savedPoint < this.log.length,
            isInvalid: this.errors.length != 0,
            errors: this.errors,
        };
    }

    public commit(patch: DbPatch<T>) {
        this.log.push({ patch });
        this.current = this.current.with(patch);
        this.autoSave && this.enqueueSave();
        this.onUpdate();
    }

    public revert() {
        this.current = this.base;
        this.errors = [];
        this.log = this.log.slice(0, this.savedPoint);
        this.onUpdate();
    }

    public push() {
        this.enqueueSave();
    }

    public rebase(newBase: Db<T>) {
        this.base = newBase;
        this.current = newBase;
        for (let n = this.savedPoint; n < this.log.length; n++) {
            this.current = this.current.with(this.log[n].patch);
        }
    }

    public commitFetch(patch: DbPatch<T>) {
        this.rebase(this.base.with(patch));
        this.onUpdate();
    }

    public enqueueFetch() {}
    public entityLens<TEntityName extends keyof T>(name: TEntityName, filter: Partial<T[TEntityName]>): DbEntityLens<T, TEntityName> {
        return new DbEntityLens(this, name, filter);
    }

    // Save logic

    private isSaveInProgress = false;
    private isSaveThrottled = false;
    private enqueueSave() {
        if (!this.isSaveInProgress && !this.isSaveThrottled) {
            this.isSaveInProgress = true;
            const lastLogEntry = this.log.length;
            const logEntriesToSave = this.log.slice(this.savedPoint, lastLogEntry);
            const updatedDb = this.current;
            const cumulativePatch = this.makeCumulativePatch(
                updatedDb,
                logEntriesToSave.map((t) => t.patch),
            );
            this.onUpdate();
            this.save(cumulativePatch)
                .then((response) => {
                    this.isSaveInProgress = false;
                    this.errors = response.validationErrors || [];
                    if (this.errors.length == 0) {
                        this.appendIdsMapping(response);
                        this.savedPoint = lastLogEntry;
                        this.base = updatedDb;
                        if (response.patch) {
                            this.commitFetch(response.patch);
                        }

                        if (this.autoSave) {
                            this.isSaveThrottled = true;
                            setTimeout(() => {
                                this.isSaveThrottled = false;
                                if (this.savedPoint < this.log.length) {
                                    this.enqueueSave();
                                }
                            }, this.throttleSaveMs);
                        }
                    }
                    this.onUpdate();
                })
                .catch(() => {
                    this.isSaveInProgress = false;
                    this.onUpdate();
                });
        }
    }

    makeCumulativePatch(updatedDb: Db<T>, patches: DbPatch<T>[]): DbPatch<T> {
        const result: DbPatch<T> = {};

        objectKeys(this.schema.entitySchemas).map((entityName) => {
            const entitySchema = this.schema.entitySchemas[entityName];
            let ids = I.Set();
            patches.forEach((patch) => {
                ids = ids.union((patch[entityName] || []).map((e) => entitySchema.getKey(e as any)));
            });
            result[entityName] = ids
                .map((id) => {
                    const entity = (updatedDb as any)[entityName]().byId(id);
                    const entityWithPatchedIds = this.replaceTempIds(entitySchema, entity);
                    return entityWithPatchedIds as any;
                })
                .toArray();
        });

        return result;
    }

    // Temp IDs logic

    public getTempId() {
        return this.lastTempId--;
    }

    protected replaceTempIds(schema: DbEntitySchema<any>, entity: Record<string, any>) {
        const patchedIds: Record<string, any> = {};
        schema.keyFields.forEach((key) => {
            patchedIds[key.name] = this.tempIdToId.get(entity[key.name], entity[key.name]);
        });
        return { ...entity, ...patchedIds };
    }

    protected appendIdsMapping(response: DbSaveResponse<T>) {
        const idsList = Object.keys(response.clientIdsMapping).map((id) => [+id, response.clientIdsMapping[id]] as [number, any]);
        this.tempIdToId = this.tempIdToId.merge(I.fromJS(idsList));
    }

    protected save(patch: DbPatch<T>): Promise<DbSaveResponse<T>> {
        return Promise.resolve({
            patch: {},
        });
    }
}
