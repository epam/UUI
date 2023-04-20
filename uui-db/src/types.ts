import { DataQuery } from '@epam/uui-core';
import { DbTable } from './DbTable';
import { IClientIdsMap } from './tempIds';

export type DbTablesSet<TTables extends DbTablesSet<TTables>> = { [TEntityName in keyof TTables]: DbTable<any, any, TTables> };

export type DbTablePatch<TEntity> = Partial<TEntity>[];

export type DbTableEntityByTable<TTable, TTables extends DbTablesSet<TTables>> = TTable extends DbTable<infer TEntity, any, TTables> ? TEntity : void;
export type DbTableIdByTable<TTable, TTables extends DbTablesSet<TTables>> = TTable extends DbTable<any, infer TId, TTables> ? TId : void;
type DbTablePatchByTable<TTable, TTables extends DbTablesSet<TTables>> = DbTablePatch<DbTableEntityByTable<TTable, TTables>>;

export type DbPatch<TTables extends DbTablesSet<TTables>> = { [TEntityName in keyof TTables]?: DbTablePatchByTable<TTables[TEntityName], TTables> };

export enum DbRelationType {
    Aggregation,
    Association
}

export type DbFieldFk<TEntity> = {
    tableName: string | ((entity: TEntity) => string);
    relationType: DbRelationType;
};

export interface DbFieldSchema<TField extends keyof TEntity, TEntity> {
    fk?: DbFieldFk<TEntity>;
    isGenerated?: boolean;
    isClientOnly?: boolean;
    isReadOnly?: boolean;
    default?: TEntity[TField];
    toServer?: (value: TEntity[TField]) => TEntity[TField];
    toClient?: (value: TEntity[TField]) => TEntity[TField];
    disableFlatten?: boolean;
}

export type DbPkFieldType = string | number | (string | number)[];

export type BeforeUpdateContext<TEntity, TId extends DbPkFieldType, TTables extends DbTablesSet<TTables>> = {
    clientIdsMap: IClientIdsMap;
    schema: DbEntitySchema<TEntity, TId, TTables>;
    tables: DbTablesSet<TTables>;
};

type DbEntityBeforeUpdateResult<TEntity, TTables extends DbTablesSet<TTables>> = {
    entity: TEntity;
    dependentEntities?: DbPatch<TTables>;
};

type DbTableIndexDefinition<TEntity> = keyof TEntity;

export type DbEntitySchema<TEntity, TId extends DbPkFieldType, TTables extends DbTablesSet<TTables>> = {
    tableName: keyof TTables;
    typeName: string;
    searchBy?: (keyof TEntity)[];
    fields?: Partial<{ [TField in keyof TEntity]: DbFieldSchema<TField, TEntity> }>;
    isClientOnly?: boolean | ((entity: Partial<TEntity>) => boolean);
    beforeUpdate?: (entity: TEntity, context: BeforeUpdateContext<TEntity, TId, TTables>) => DbEntityBeforeUpdateResult<TEntity, TTables>;
    primaryKey: TId extends any[] ? KeysOfType<TEntity, string | number>[] : KeysOfType<TEntity, string | number>;
    indexes?: DbTableIndexDefinition<TEntity>[];
    deleteFlag?: keyof TEntity;
};

export type DbSchema<TTables extends DbTablesSet<TTables>> = {
    [TTypeName in keyof TTables]: DbEntitySchema<any, any, TTables>;
};

export interface DbQuery<TEntity> extends DataQuery<TEntity> {}

export interface IQueryable<TEntity, TId> {
    query(q: DbQuery<TEntity>): TEntity[];
    byId(id: TId): TEntity;
}

export interface ServerError {
    message?: string;
}

type DbSaveEntityResponse<TEntity, TId> = {
    id: TId;
    payload: Partial<TEntity>;
};

export interface DbSaveResponse<TTables extends DbTablesSet<TTables>> {
    submit: {
        [EntityName in keyof TTables]?: DbSaveEntityResponse<DbTableEntityByTable<TTables[EntityName], TTables>, DbTableIdByTable<TTables[EntityName], TTables>>[];
    };
}

export type DbViewFunction<TDb, TResult, TParams = void, TDependencies = void> = (db: TDb, parameters?: TParams, dependencies?: TDependencies) => TResult;

export interface DbViewOptions<TDb, TResult, TParams, TDependencies = void> {
    getKey?: (parameters: TParams) => string;
    getDependencies?: (db: TDb, parameters: TParams) => TDependencies;
    compareDependencies?: (prev: TDependencies, next: TDependencies) => boolean;
    compareResults?: (prev: TResult, current: TResult) => boolean;
    traceDiff?: boolean;
}

export interface DbView<TDb, TResult, TParams = void, TDependencies = void> extends DbViewOptions<TDb, TResult, TParams, TDependencies> {
    compute: DbViewFunction<TDb, TResult, TParams, TDependencies>;
}

export type KeysOfType<T, TProp> = { [P in keyof T]: T[P] extends TProp ? P : never }[keyof T];

export interface DbSubscription<TValue, TParams> {
    update(params: TParams): TValue;
    currentValue: TValue;
    currentParams: TParams;
    onUpdate: (newValue: TValue) => void;
    unsubscribe: () => void;
}

export type ViewCacheItem = { dependencies: any; currentValue: any; computedOnDb: any };

export interface LoadingState<TRequest> {
    isLoading: boolean;
    isComplete: boolean;
    request: TRequest;
    missing?: TRequest;
}

export interface ILoadingTracker<TRequest, TResult> {
    diff(request: TRequest): TRequest;
    append(request: TRequest, result?: TResult): void;
    count?(request: TRequest): { knownCount: number; exactCount: number };
}
