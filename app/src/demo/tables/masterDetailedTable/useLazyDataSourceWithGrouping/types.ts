import { LazyDataSourceProps } from '@epam/uui-core';
import { ID, PATH } from './constants';

export type BaseGroups = { [K in string]: {} };
export type BaseGroupsIds<TGroups> = { [K in keyof TGroups]: unknown };

export type UnboxGroupsFromUnion<TypeField extends keyof Group, Group extends { [K in TypeField]: string }> = {
    [Type in Group[TypeField] as Type]: Extract<Group, { [K in TypeField]: Type }>;
};

export type ToUnion<TGroups> = TGroups[keyof TGroups];
export type GroupByTokens<TGroups, TFilter extends BaseFilter<TGroups>> = UnboxArray<TFilter[keyof TGroups]['groupBy']>;
export type GroupBy<TGroups, TFilter extends BaseFilter<TGroups>> = GroupByTokens<TGroups, TFilter> | GroupByTokens<TGroups, TFilter>[];

export type UnboxArray<T extends Array<any> | any> = T extends Array<infer U> ? U : T;

export type BaseFilter<TGroups> = {
    [K in keyof TGroups]: {
        groupBy?: GroupByKeys<TGroups>;
    }
};

export interface GetType<TGroups, TFilter extends BaseFilter<TGroups>> {
    getType: (entity: ToUnion<TGroups>) => keyof TGroups;
    getGroupBy: () => GroupBy<TGroups, TFilter>,
}

type CommonConfigDefault<TGroups, TId extends BaseGroupsIds<TGroups>, TFilter extends BaseFilter<TGroups>> =
    Partial<LazyDataSourceProps<ToUnion<TGroups>, ToUnion<ComplexId<TGroups, TId, TFilter>>[], TFilter[keyof TGroups]>>
    & GetType<TGroups, TFilter>
    & {
        isLastNestingLevel?: (item: TGroups[keyof TGroups]) => boolean;
    };

export type ConfigDefault<TGroups, TId extends BaseGroupsIds<TGroups>, TFilter extends BaseFilter<TGroups>> =
    CommonConfigDefault<TGroupsWithMeta<TGroups, TId, TFilter>, TId, TFilter>;

export type LazyDataSourceGetters<TItem, TId, TFilter> =
    Pick<LazyDataSourceProps<TItem, TId, TFilter>, 'getId' | 'getParentId' | 'getChildCount' | 'isFoldedByDefault'>;

type ApiType<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> = (
    request: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter[TType]>['api']>[0],
    context: Parameters<LazyDataSourceProps<TGroups[keyof TGroups], TId[TType], TFilter[TType]>['api']>[1],
) => ReturnType<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter[TType]>['api']>;

type GetRowOptionsType<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> = (
    ...args: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter>['getRowOptions']>
) => ReturnType<LazyDataSourceProps<TGroups[keyof TGroups], ToUnion<ComplexId<TGroups, TId, TFilter>>[], TFilter>['getRowOptions']>;

type EntityLazyDataSourceProps<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> =
    LazyDataSourceGetters<TGroupsWithMeta<TGroups, TId, TFilter>[TType], TId[TType], TFilter[TType]>
    & {
        api: ApiType<TGroups, TType, TId, TFilter>;
        getRowOptions: GetRowOptionsType<TGroups, TType, TId, TFilter>;
        isLastNestingLevel: (item: TGroups[TType]) => boolean;
        getFilter: (filter: FilterFromParentId<TGroups, TId, TFilter>) => TFilter[TType];
    };

export type EntityConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId, TFilter>>;

export type GroupingConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId, TFilter>> & { type: TType };

export type EntitiesConfig<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> = {
    [TType in keyof TGroups]?: EntityConfig<TGroups, TType, TId, TFilter>;
};

export type GroupingsConfig<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> = {
    [TType in keyof TGroups]?: GroupingConfig<TGroups, TType, TId, TFilter>;
};

export type ComplexId<TGroups, TId extends BaseGroupsIds<TGroups>, TFilter extends BaseFilter<TGroups>> = {
    [K in keyof TGroups]: [K, GroupByTokens<TGroups, TFilter>, TId[K]];
};

type ExtractGroupByKey<Property extends PropertyKey> = Property extends `${infer P}Id` ? P : never;

export type GroupByKey<TGroups> = {
    [K in keyof TGroups]: ExtractGroupByKey<keyof TGroups[K]>;
}[keyof TGroups];

export type GroupByKeys<TGroups> = GroupByKey<TGroups> | GroupByKey<TGroups>[];

export type FilterForGroupBy<
    TGroups,
    TId extends BaseGroupsIds<TGroups>
> = {
    [Key in GroupByKey<TGroups>]?: TId[keyof TId];
};

export type TGroupWithMeta<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> = TGroups[TType] & {
    [ID]?: ToUnion<ComplexId<TGroups, TId, TFilter>>[],
    [PATH]?: GroupByTokens<TGroups, TFilter>[];
};

export type TGroupsWithMeta<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> = {
    [TType in keyof TGroups]: TGroupWithMeta<TGroups, TType, TId, TFilter>;
};

type TFilterGroupByTokens<TGroups, TFilter extends BaseFilter<TGroups>> = {
    [K in keyof TFilter]: UnboxArray<TFilter[K]['groupBy']>;
};

export type FilterFromParentId<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> = {
    [K in keyof TGroups]: {
        [G in TFilterGroupByTokens<TGroups, TFilter>[K]]?: TId[K];
    };
}[keyof TGroups];
