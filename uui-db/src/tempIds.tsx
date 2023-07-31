import {
    DbTablePatch, DbTablesSet, DbPatch, DbFieldSchema, DbSaveResponse,
} from './types';
import { Db } from './Db';
import { objectKeys } from './utils';
import { DataQueryFilter, DataQueryFilterCondition } from '@epam/uui-core';

let lastTempId = -1;

export function getTempId() {
    return --lastTempId;
}

export function isTempId(val: any): val is number {
    return typeof val === 'number' && val < 0;
}

export interface IClientIdsMap {
    clientToServer(id: number): any;
    serverToClient(tableName: string, id: any): number;
    clientToServerRequest<T>(request: T): T;
    clientToServerDataFilter(filter: DataQueryFilter<any>): DataQueryFilter<any>;
}

export class TempIdMap<TTables extends DbTablesSet<TTables>> implements IClientIdsMap {
    private serverToClientIds = new Map<keyof TTables, Map<any, number>>();
    private clientToServerIds = new Map<number, any>();
    constructor(private db: Db<TTables>) {}
    public clientToServer = (id: number): any => this.clientToServerIds.get(id);
    public serverToClient = (tableName: string, id: any): number => this.getServerToClientMap(tableName as any).get(id);
    public clientToServerRequest = (request: any) => {
        request = { ...request };

        if (request.filter) {
            request.filter = this.clientToServerDataFilter(request.filter);
        }

        return request;
    };

    public clientToServerDataFilter = (filter: DataQueryFilter<any>) => {
        filter = { ...filter };
        const keys = Object.keys(filter);

        // I hope that we can rely that there won't be any negative numbers, which are not IDs, in queries.
        // We need to invent better heuristics or a schema otherwise.
        const clientToServer = (id: number) => {
            const found = this.clientToServer(id);
            if (found) {
                return found;
            } else {
                return id;
            }
        };

        for (let n = 0; n < keys.length; n++) {
            const key = keys[n];
            let condition = filter[key] as DataQueryFilterCondition<any>;
            if (condition != null && typeof condition === 'object') {
                condition = { ...condition };
                if ('in' in condition && Array.isArray(condition.in) && condition.in.length) {
                    condition.in = condition.in.map(clientToServer);
                }
            } else {
                condition = clientToServer(condition);
            }
            filter[key] = condition;
        }
        return filter;
    };

    private copyPatch(patch: DbPatch<TTables>) {
        const newPatch = { ...patch };

        objectKeys(patch).forEach((tableName) => {
            const tablePatch: DbTablePatch<any> = patch[tableName].map((entityPatch) => ({ ...entityPatch }));
            newPatch[tableName] = tablePatch;
        });

        return newPatch;
    }

    // Iterate thru every field in every patch for every table, matching certain field criteria. The patch is mutated!
    protected mapFields(
        patch: DbPatch<TTables>,
        filter: (schema: DbFieldSchema<any, any>, name: string) => boolean,
        callback: (fieldName: any, fieldSchema: DbFieldSchema<any, any>, fieldValue: any, entityPatch: any, tableName: keyof TTables) => void,
    ): void {
        objectKeys(patch).forEach((tableName) => {
            const schema = this.db.tables[tableName].schema;
            const fields = objectKeys(schema.fields || [])
                .map((fieldName) => {
                    const fieldSchema = schema.fields[fieldName as any];
                    if (filter(fieldSchema, fieldName as string)) {
                        return { name: fieldName, schema: fieldSchema };
                    }
                })
                .filter((f) => !!f);

            if (!fields.length) {
                return;
            }

            patch[tableName].forEach((entityPatch) => {
                for (let n = 0; n < fields.length; n++) {
                    const field = fields[n];

                    const fieldValue = entityPatch[field.name as any];

                    callback(field.name, field.schema, fieldValue, entityPatch, tableName);
                }
            });
        });
    }

    protected getServerToClientMap(tableName: keyof TTables) {
        const existing = this.serverToClientIds.get(tableName);

        if (existing) {
            return existing;
        } else {
            const newMap = new Map();
            this.serverToClientIds.set(tableName, newMap);
            return newMap;
        }
    }

    public serverToClientPatch(patch: DbPatch<TTables>) {
        patch = this.copyPatch(patch);

        // We map PK in a separate pass, as we need to remap all PKs before re-mapping FKs
        this.mapFields(
            patch,
            (f) => f.isGenerated,
            (fieldName, fieldSchema, fieldValue, entityPatch, tableName) => {
                let clientId = this.getServerToClientMap(tableName).get(fieldValue);
                if (!clientId) {
                    clientId = getTempId();
                    this.clientToServerIds.set(clientId, fieldValue);
                    this.getServerToClientMap(tableName).set(fieldValue, clientId);
                }
                entityPatch[fieldName] = clientId;
            },
        );

        this.mapFields(
            patch,
            (f) => !!(f.fk || f.default != null || f.toClient),
            (fieldName, fieldSchema, fieldValue, entityPatch) => {
                let isUndefined = typeof fieldValue === 'undefined';

                if (fieldSchema.default != null && fieldValue == null) {
                    fieldValue = fieldSchema.default;
                    isUndefined = false;
                }

                if (fieldSchema.fk && fieldValue != null) {
                    const fkTableName = typeof fieldSchema.fk.tableName === 'function' ? fieldSchema.fk.tableName(entityPatch) : fieldSchema.fk.tableName;
                    let clientId = this.getServerToClientMap(fkTableName as keyof TTables).get(fieldValue);
                    if (!clientId) {
                        clientId = getTempId();
                        this.clientToServerIds.set(clientId, fieldValue);
                        this.getServerToClientMap(fkTableName as keyof TTables).set(fieldValue, clientId);
                    }
                    fieldValue = clientId;
                }

                if (!isUndefined && fieldSchema.toClient) {
                    fieldValue = fieldSchema.toClient(fieldValue);
                }

                if (!isUndefined) {
                    entityPatch[fieldName] = fieldValue;
                }
            },
        );

        return patch;
    }

    public clientToServerPatch(patch: DbPatch<TTables>) {
        patch = this.copyPatch(patch);

        this.mapFields(
            patch,
            (f) => f.isGenerated || !!f.fk,
            (fieldName, fieldSchema, fieldValue, entityPatch) => {
                if (fieldValue != null) {
                    const existingId = this.clientToServerIds.get(fieldValue);
                    if (existingId) {
                        entityPatch[fieldName] = existingId;
                    }
                }
            },
        );

        this.mapFields(
            patch,
            (f) => !(f.isClientOnly || f.isReadOnly) && !!f.toServer,
            (fieldName, fieldSchema, _, entityPatch) => {
                entityPatch[fieldName] = fieldSchema.toServer(entityPatch[fieldName]);
            },
        );

        this.mapFields(
            patch,
            (meta) => meta.isClientOnly || meta.isReadOnly,
            (fieldName, _, __, entityPatch) => {
                delete entityPatch[fieldName];
            },
        );

        return patch;
    }

    public appendServerMapping(response: DbSaveResponse<TTables>) {
        objectKeys(response.submit).forEach((tableName) => {
            if (this.db.tables[tableName]) {
                const tablePatch = response.submit[tableName];
                if (tablePatch) {
                    const serverToClientIds = this.getServerToClientMap(tableName);
                    const table = this.db.tables[tableName];

                    tablePatch.forEach((patch) => {
                        if (isTempId(patch.id)) {
                            const clientId = patch.id;
                            const serverId = table.getId(patch.payload);
                            serverToClientIds.set(serverId, clientId);
                            this.clientToServerIds.set(clientId, serverId);
                        }
                    });
                }
            }
        });
    }
}
