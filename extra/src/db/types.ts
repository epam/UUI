import { QueryBuilder } from './QueryBuilder';
import { DbSchema, DbEntitySchema } from './DbSchema';
import { Map } from 'immutable';
import { SortDirection } from '@epam/uui-core';

/* Metadata */

// export type DbEntitySchema<E> = {[TField in keyof E]?: DbEntityFieldSchema<E[TField]> }

export interface DbEntityFieldSchema<TField> {
    isKey?: boolean;
}

/* Db State */

export type DbState = {
    schema: DbSchema<any>;
    entities: EntitiesState;
    cache: { [key: string]: any };
};

export type EntitiesState = { [entityName: string]: EntityState };

export interface EntityState {
    byKey: Map<any, any>;
}

/* Modification */

export type DbPatch<T> = { [TEntityName in keyof T]?: Partial<T[TEntityName]>[] };

/* Query */

export interface ColumnOrder {
    name: string;
    dir: SortDirection;
}

export interface DbQuery {
    entityName: string;
    pattern?: object;
    order?: ColumnOrder[];
    range?: { from: number; count: number };
}

export interface IQueryable<T = any> {
    byId(id: any): T;
    range(from: number, count: number): T[];
    count(): number;
    one(): T;
    toArray(): T[];
    find(pattern: Partial<T>): IQueryable<T>;
    orderBy(name: keyof T, dir?: SortDirection): IQueryable<T>;
    thenBy(name: keyof T, dir?: SortDirection): IQueryable<T>;
}

/* Db API */

export type EntityApi<TEntity> = {
    (pattern?: Partial<TEntity>): QueryBuilder<TEntity>;
    schema: DbEntitySchema<TEntity>;
    // byId(...id: any[]): TEntity;
};

export type Db<T> = { [TEntity in keyof T]: EntityApi<T[TEntity]> } & {
    with(input: DbPatch<T>): Db<T>;
};

export interface DbFieldSchema<T> {
    pk?: boolean;
    fk?: boolean;
    dataType?: 'number' | 'string';
}

export type DbEntityFieldsSchema<T> = { [TKey in keyof T]?: DbFieldSchema<T[TKey]> };
