import { Db } from './Db';
import {
    DbPatch, DbTablesSet, DbRelationType, DbEntitySchema, DbPkFieldType,
} from './types';
import { DbTable } from './DbTable';
import * as I from 'immutable';
import { objectKeys } from './utils';
import groupBy from 'lodash.groupby';
import map from 'lodash.map';
import merge from 'lodash.merge';
import countBy from 'lodash.countby';
import filter from 'lodash.filter';
import forEach from 'lodash.foreach';
import pick from 'lodash.pick';
import { IClientIdsMap } from './tempIds';

export function unionPatches<TTables extends DbTablesSet<TTables>>(patches: DbPatch<TTables>[]): DbPatch<TTables> {
    const result: DbPatch<TTables> = {};

    patches.forEach((patch) => {
        objectKeys(patch).forEach((tableName) => {
            result[tableName] = result[tableName] ? [...result[tableName], ...patch[tableName]] : patch[tableName];
        });
    });

    return result;
}

export function mergeEntityPatches<TTables extends DbTablesSet<TTables>>(tables: TTables, patch: DbPatch<TTables>): DbPatch<TTables> {
    const result: DbPatch<TTables> = {};

    objectKeys(patch).forEach((key) => {
        const table = tables[key];
        const groupedEntities = groupBy(patch[key], (item) => table.getId(item));
        const tablePatch = map(groupedEntities, (entities) => {
            const tablePatchResult = merge({}, ...entities);

            if (process.env.NODE_ENV !== 'production') {
                const props = objectKeys(tablePatchResult).filter(
                    (prop) =>
                        Object.keys(
                            countBy(
                                entities.filter((entity) => entity[prop as string] !== undefined),
                                (entity) => entity[prop as string],
                            ),
                        ).length > 1,
                );
                if (props.length) {
                    console.warn('mergeEntityPatches: Different property values found for the same entity.\nProperty names:\n', props, '\nEntities:\n', ...entities);
                }
            }

            return tablePatchResult;
        });

        result[key] = tablePatch;
    });

    return result;
}

function flattenResponseHelper<TTables extends DbTablesSet<any>>(result: DbPatch<TTables>, object: any, tablesByTypeName: Record<string, DbTable<any, any, any>>) {
    if (Array.isArray(object)) {
        object.forEach((item) => flattenResponseHelper(result, item, tablesByTypeName));
    } else if (typeof object === 'object') {
        const clone: any = {};
        let tableKey;
        let fields: { [id: string]: any } = {};

        if ('__typename' in object) {
            const table = tablesByTypeName[object.__typename];
            if (table) {
                tableKey = table.schema.tableName as string;
                fields = table.schema.fields;
            }
        }

        for (const key in object) {
            const value = object[key];
            const field = fields[key];

            if (
                (field && !!field.disableFlatten)
                || typeof value !== 'object'
                || value === null
                || (Array.isArray(value) && value.every((item) => typeof item !== 'object'))
            ) {
                clone[key] = value;
            } else {
                flattenResponseHelper(result, value, tablesByTypeName);
            }
        }

        if (tableKey) {
            result[tableKey].push(clone);
        }
    }
}

export function flattenResponse<TTables extends DbTablesSet<any>>(response: any, tables: TTables): DbPatch<TTables> {
    const result: DbPatch<TTables> = {};

    const tablesByTypeName: Record<string, DbTable<any, any, any>> = {};
    Object.values(tables).forEach((table) => (tablesByTypeName[table.schema.typeName] = table));
    objectKeys(tables).forEach(() => tablesByTypeName);

    objectKeys(tables).forEach((key) => (result[key] = []));

    flattenResponseHelper(result, response, tablesByTypeName);
    return result;
}

export function isPatchBlank<TTables extends DbTablesSet<TTables>>(patch: DbPatch<TTables>): boolean {
    return !objectKeys(patch).some((key) => patch[key].length > 0);
}

/**
 * Given several patches, creates a new single patch with all fields from all entities in all patches.
 */
export function makeCumulativePatch<TTables extends DbTablesSet<TTables>>(
    updatedDb: Db<TTables>,
    patches: DbPatch<TTables>[],
    clientIdsMap: IClientIdsMap,
): DbPatch<TTables> {
    const result: DbPatch<TTables> = {};

    objectKeys(updatedDb.tables).forEach((entityName) => {
        const table = updatedDb.tables[entityName];
        const schema = table.schema;

        let ids = I.Set();
        patches.forEach((patch) => {
            const filteredPatch = (patch[entityName] || []).filter((entity) => hasServerFields(entity, schema, clientIdsMap, updatedDb.tables));
            ids = ids.union(filteredPatch.map((e) => table.getId(e)));
        });

        const entities = ids
            .map((id) => table.byId(id))
            .filter((e) => !isClientOnly(e, schema))
            .toArray();

        if (entities.length > 0) {
            result[entityName] = entities;
        }
    });

    return result;
}

export function isClientOnly<T, TId extends DbPkFieldType, TTables extends DbTablesSet<TTables>>(entity: T, schema: DbEntitySchema<T, TId, TTables>) {
    if (typeof schema.isClientOnly === 'function') {
        return schema.isClientOnly(entity);
    }

    return !!schema.isClientOnly;
}

export function getId<T, TId extends DbPkFieldType, TTables extends DbTablesSet<TTables>>(entity: Partial<T>, schema: DbEntitySchema<T, TId, TTables>): TId {
    if (typeof schema.primaryKey == 'string') {
        return (entity as any)[schema.primaryKey] as TId;
    }

    const result: (string | number)[] = [];
    forEach(pick(entity, schema.primaryKey), (value) => {
        result.push(value as unknown as string | number);
    });

    return result as TId;
}

export function isNew<T, TId extends DbPkFieldType, TTables extends DbTablesSet<TTables>>(
    entity: Partial<T>,
    schema: DbEntitySchema<T, TId, TTables>,
    clientIdsMap: IClientIdsMap,
) {
    const id = getId(entity, schema);
    return !clientIdsMap.clientToServer(id as number);
}

export function hasServerFields<T, TId extends DbPkFieldType, TTables extends DbTablesSet<TTables>>(
    entity: Partial<T>,
    schema: DbEntitySchema<T, TId, TTables>,
    clientIdsMap: IClientIdsMap,
    tables: TTables,
) {
    const fullEntity = {
        ...(tables[schema.tableName].byId((entity as any).id) || {}),
        ...entity,
    };

    if (isClientOnly(fullEntity, schema)) {
        return false;
    }

    return objectKeys(entity).some((fieldName) => {
        const fieldSchema = schema.fields[fieldName];
        return !fieldSchema || !(fieldSchema.isClientOnly || fieldSchema.isReadOnly || (fieldSchema.isGenerated && !isNew(entity, schema, clientIdsMap)));
    });
}

export function getParentEntities<TTables extends DbTablesSet<TTables>>(patch: DbPatch<TTables>, tables: TTables): DbPatch<TTables> {
    const dependenciesPatch: DbPatch<TTables> = {};
    objectKeys(patch).forEach((key) => {
        const table = tables[key];
        const tableSchema = table.schema;

        const fields = filter(
            map(tableSchema.fields, (field, name) => ({ ...field, name })),
            (field) => field.fk && field.fk.relationType == DbRelationType.Aggregation,
        );

        const tablePatch = patch[key];
        fields.forEach((field) => {
            const {
                fk: { tableName },
                name,
            } = field;
            tablePatch.forEach((entity) => {
                const actualTableName = (typeof tableName == 'function' ? tableName(entity) : tableName) as keyof TTables;
                const dbEntity = table.byId(table.getId(entity));
                const parentEntity = tables[actualTableName].byId(dbEntity[name]);
                const idFields = pick(parentEntity, tables[actualTableName].schema.primaryKey);
                if (parentEntity) {
                    dependenciesPatch[actualTableName] = dependenciesPatch[actualTableName] || [];
                    dependenciesPatch[actualTableName].push(idFields as any);
                }
            });
        });
    });
    return dependenciesPatch;
}

export function getEntityParentDependencies<TEntity, TTables extends DbTablesSet<TTables>>(
    entity: Partial<TEntity>,
    entityName: keyof TTables,
    tables: TTables,
): DbPatch<TTables> {
    let patch = { [entityName]: [entity] } as DbPatch<TTables>;
    const resultPatches: DbPatch<TTables>[] = [];

    while (true) {
        const parents = getParentEntities(patch, tables);
        if (isPatchBlank(parents)) {
            break;
        }
        resultPatches.push(parents);
        patch = parents;
    }

    let result = unionPatches([patch, ...resultPatches]);
    result = mergeEntityPatches(tables, result);

    return result;
}
