import { LazyDataSourceProps } from '@epam/uui-core';

export type UnboxGroupsFromUnion<TypeField extends keyof Record, Record extends { [K in TypeField]: string }> = {
    [Type in Record[TypeField]]: Extract<Record, { [K in TypeField]: Type }>;
};

export type UnboxUnionFromGroups<TGroups> = TGroups[keyof TGroups];

export interface GetType<TGroups, TId, TFilter> {
    getType: (entity: UnboxUnionFromGroups<TGroups>) => keyof TGroups;
    getTypeAndId: (id: TId) => [keyof TGroups, string | number];
    getGroupBy: (filter: TFilter) => string;
}

export type ConfigDefault<TGroups, TId, TFilter = any> =
    Partial<LazyDataSourceProps<UnboxUnionFromGroups<TGroups>, TId, TFilter>>
    & GetType<TGroups, TId, TFilter>;

interface GroupByField {
    groupBy: string | string[] | null;
}

export type LazyDataSourceGetters<TItem, TId, TFilter> =
    Pick<LazyDataSourceProps<TItem, TId, TFilter>, 'getId' | 'getParentId' | 'getChildCount' | 'getRowOptions' | 'isFoldedByDefault'>;

type EntityLazyDataSourceProps<TGroups, TType extends keyof TGroups, TId, TFilter> =
    LazyDataSourceGetters<TGroups[TType], TId, TFilter>
    & { api: LazyDataSourceProps<TGroups[keyof TGroups], TId, TFilter>['api'] };

export type EntityConfig<TGroups, TType extends keyof TGroups, TId, TFilter> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId, TFilter>>
    & GroupByField;

export type EntitiesConfig<TGroups, TId, TFilter> = {
    [TType in keyof TGroups]?: EntityConfig<TGroups, TType, TId, TFilter>;
};
