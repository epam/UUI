import { LazyDataSourceProps } from '@epam/uui-core';

export type UnboxGroupsFromUnion<TypeField extends keyof Group, Group extends { [K in TypeField]: string }> = {
    [Type in Group[TypeField] as Type]: Extract<Group, { [K in TypeField]: Type }>;
};

export type UnboxUnionFromGroups<TGroups> = TGroups[keyof TGroups];

export type UnboxArray<T extends Array<any> | any> = T extends Array<infer U> ? U : T;

export interface GetType<TGroups> {
    getType: (entity: UnboxUnionFromGroups<TGroups>) => keyof TGroups;
    getGroupBy: () => GroupByKeys<TGroups>;
}

export type ConfigDefault<TGroups, TId extends { [K in keyof TGroups]: unknown }, TFilter extends { groupBy: GroupByKeys<TGroups> }> =
    Partial<LazyDataSourceProps<UnboxUnionFromGroups<TGroups>, [keyof TGroups, TId[keyof TGroups]], TFilter>>
    & GetType<TGroups>;

export type LazyDataSourceGetters<TItem, TId, TFilter> =
    Pick<LazyDataSourceProps<TItem, TId, TFilter>, 'getId' | 'getParentId' | 'getChildCount' | 'getRowOptions' | 'isFoldedByDefault'>;

type EntityLazyDataSourceProps<TGroups, TType extends keyof TGroups, TId, TFilter extends { groupBy: GroupByKeys<TGroups> }> =
    LazyDataSourceGetters<TGroups[TType], TId, TFilter>
    & {
        api: (
            ...args: Parameters<LazyDataSourceProps<TGroups[TType], TId, TFilter>['api']>
        ) => ReturnType<LazyDataSourceProps<TGroups[keyof TGroups], TId, TFilter>['api']>;
    };

export type EntityConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy: GroupByKeys<TGroups> }
> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId[TType], TFilter>>;

export type GroupingConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy: GroupByKeys<TGroups> }
> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId[TType], TFilter>> & { type: TType };

export type EntitiesConfig<
    TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy: GroupByKeys<TGroups> }
> = {
    [TType in keyof TGroups]?: EntityConfig<TGroups, TType, TId, TFilter>;
};

export type GroupingsConfig<
    TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy: GroupByKeys<TGroups> }
> = {
    [TType in keyof TGroups]?: GroupingConfig<TGroups, TType, TId, TFilter>;
};

export type ComplexId<TGroups, TId extends { [K in keyof TGroups]: unknown }> = {
    [K in keyof TGroups]: [K, TId[K]];
};

type ExtractGroupByKey<Property extends PropertyKey> = Property extends `${infer P}Id` ? P : never;

export type GroupByKey<TGroups> = {
    [K in keyof TGroups]: ExtractGroupByKey<keyof TGroups[K]>;
}[keyof TGroups];

export type GroupByKeys<TGroups> = GroupByKey<TGroups> | GroupByKey<TGroups>[];
