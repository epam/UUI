import { LazyDataSourceProps } from '@epam/uui-core';
import { ID, PATH } from './constants';

export type BaseGroups = { [K in string]: {} };
export type BaseGroupsIds<TGroups> = { [K in keyof TGroups]: unknown };

export type UnboxGroupsFromUnion<TypeField extends keyof Group, Group extends { [K in TypeField]: string }> = {
    [Type in Group[TypeField] as Type]: Extract<Group, { [K in TypeField]: Type }>;
};

export type ToUnion<TGroups> = TGroups[keyof TGroups];
export type GroupByTokens<TGroups, TFilter extends BaseFilter<TGroups>> = UnboxArray<TFilter['groupBy']>;
export type GroupBy<TGroups, TFilter extends BaseFilter<TGroups>> = GroupByTokens<TGroups, TFilter> | GroupByTokens<TGroups, TFilter>[];

export type UnboxArray<T extends Array<any> | any> = T extends Array<infer U> ? U : T;

export type BaseFilter<TGroups> = {
    groupBy?: GroupByKeys<TGroups>;
};

export interface GetType<TGroups, TFilter extends BaseFilter<TGroups>> {
    getType: (entity: ToUnion<TGroups>) => keyof TGroups;
    getGroupBy: () => GroupBy<TGroups, TFilter>,
}

type CommonConfigDefault<TGroups, TId extends BaseGroupsIds<TGroups>, TFilter extends BaseFilter<TGroups>> =
    Partial<LazyDataSourceProps<ToUnion<TGroups>, ToUnion<ComplexId<TGroups, TId, TFilter>>[], TFilter>>
    & GetType<TGroups, TFilter>
    & {
        isLastNestingLevel?: (item: TGroups[keyof TGroups]) => boolean;
        getFilterFromGroupByPath?: (path: ToUnion<ComplexId<TGroups, TId, TFilter>>[]) => TFilter,
    };

export type ConfigDefault<TGroups, TId extends BaseGroupsIds<TGroups>, TFilter extends BaseFilter<TGroups>> =
    CommonConfigDefault<TGroupsWithMeta<TGroups, TId, TFilter>, TId, TFilter>;

export type LazyDataSourceGetters<TItem, TId, TFilter> =
    Pick<LazyDataSourceProps<TItem, TId, TFilter>, 'getId' | 'getParentId' | 'getChildCount' | 'isFoldedByDefault'>;

type EntityLazyDataSourceProps<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> =
    LazyDataSourceGetters<TGroups[TType], TId[TType], TFilter>
    & {
        api: (
            request: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter>['api']>[0],
            context: Parameters<LazyDataSourceProps<TGroups[keyof TGroups], TId[TType], TFilter>['api']>[1],
        ) => ReturnType<LazyDataSourceProps<TGroups[keyof TGroups], TId[TType], TFilter>['api']>;
        getRowOptions: (
            ...args: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter>['getRowOptions']>
        ) => ReturnType<LazyDataSourceProps<TGroups[keyof TGroups], ToUnion<ComplexId<TGroups, TId, TFilter>>[], TFilter>['getRowOptions']>;

        isLastNestingLevel: (item: TGroups[TType]) => boolean;
    };

export type EntityConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> =
    Partial<EntityLazyDataSourceProps<TGroupsWithMeta<TGroups, TId, TFilter>, TType, TId, TFilter>>;

export type GroupingConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> =
    Partial<EntityLazyDataSourceProps<TGroupsWithMeta<TGroups, TId, TFilter>, TType, TId, TFilter>> & { type: TType };

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
