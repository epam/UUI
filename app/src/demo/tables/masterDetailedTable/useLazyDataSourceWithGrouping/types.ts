import { LazyDataSourceProps } from '@epam/uui-core';
import { ID, PATH } from './constants';

export type BaseGroups = { [K in string]: {} };
export type BaseGroupsIds<TGroups> = { [K in keyof TGroups]: unknown };

export type UnboxGroupsFromUnion<TypeField extends keyof Group, Group extends { [K in TypeField]: string }> = {
    [Type in Group[TypeField] as Type]: Extract<Group, { [K in TypeField]: Type }>;
};

export type ToUnion<TGroups> = TGroups[keyof TGroups];

export type UnboxArray<T extends Array<any> | any> = T extends Array<infer U> ? U : T;

export type BaseFilter<TGroups, TGroupBy extends BaseGroupBy<TGroups>> = {
    [K in keyof TGroups]: {
        groupBy?: keyof TGroupBy;
    } | {};
};

export type BaseGroupBy<TGroups> = {
    [K in string]: keyof TGroups;
};

export interface GetType<
    TGroups,
    TGroupBy extends BaseGroupBy<TGroups>
> {
    getType: (entity: TGroups[keyof TGroups]) => keyof TGroups;
    getGroupBy: () => GroupByForType<TGroups, TGroupBy, keyof TGroups> | GroupByForType<TGroups, TGroupBy, keyof TGroups>[],
}

type CommonConfigDefault<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>
> =
    Partial<LazyDataSourceProps<ToUnion<TGroups>, ToUnion<ComplexId<TGroups, TId, TGroupBy>>[], TFilter[keyof TGroups]>>
    & GetType<TGroups, TGroupBy>
    & {
        isLastNestingLevel?: (item: TGroups[keyof TGroups]) => boolean;
    };

export type ConfigDefault<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>
> =
    CommonConfigDefault<TGroupsWithMeta<TGroups, TId, TGroupBy>, TId, TFilter, TGroupBy>;

export type LazyDataSourceGetters<TItem, TId, TFilter> =
    Pick<LazyDataSourceProps<TItem, TId, TFilter>, 'getId' | 'getParentId' | 'getChildCount' | 'isFoldedByDefault'>;

type ApiType<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>
> = (
    request: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter[TType]>['api']>[0],
    context: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter[TType]>['api']>[1],
) => ReturnType<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter[TType]>['api']>;

type GetRowOptionsType<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>
> = (
    ...args: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter>['getRowOptions']>
) => ReturnType<LazyDataSourceProps<TGroups[keyof TGroups], ToUnion<ComplexId<TGroups, TId, TGroupBy>>[], TFilter>['getRowOptions']>;

type EntityLazyDataSourceProps<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>
> =
    LazyDataSourceGetters<TGroupsWithMeta<TGroups, TId, TGroupBy>[TType], TId[TType], TFilter[TType]>
    & {
        api: ApiType<TGroups, TType, TId, TFilter, TGroupBy>;
        getRowOptions: GetRowOptionsType<TGroups, TType, TId, TFilter, TGroupBy>;
        isLastNestingLevel: (item: TGroups[TType]) => boolean;
        getFilter: (filter: FilterFromParentId<TGroups, TId, TGroupBy>) => Omit<TFilter[TType], 'groupBy'>;
    };

export type EntityConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>
> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId, TFilter, TGroupBy>>;

export type GroupingConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>
> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId, TFilter, TGroupBy>> & { type: TType };

export type EntitiesConfig<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>
> = {
    [TType in keyof TGroups]?: EntityConfig<TGroups, TType, TId, TFilter, TGroupBy>;
};

export type GroupingsConfig<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>
> = {
    [TType in keyof TGroups]?: GroupingConfig<TGroups, TType, TId, TFilter, TGroupBy>;
};

export type ComplexId<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TGroupBy extends BaseGroupBy<TGroups>
> = {
    [K in keyof TGroups]: GroupByForType<TGroups, TGroupBy, K> extends never
        ? [K, undefined, TId[K]]
        : [K, GroupByForType<TGroups, TGroupBy, K>, TId[K]];
};

export type TGroupWithMeta<
    TGroups,
    TType extends keyof TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TGroupBy extends BaseGroupBy<TGroups>
> = TGroups[TType] & {
    [ID]?: ToUnion<ComplexId<TGroups, TId, TGroupBy>>[],
    [PATH]?: Array<GroupByForType<TGroups, TGroupBy, keyof TGroups>>;
};

export type TGroupsWithMeta<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TGroupBy extends BaseGroupBy<TGroups>
> = {
    [TType in keyof TGroups]: TGroupWithMeta<TGroups, TType, TId, TGroupBy>;
};

export type FilterFromParentId<
    TGroups,
    TId extends BaseGroupsIds<TGroups>,
    TGroupBy extends BaseGroupBy<TGroups>
> = {
    [Property in keyof TGroupBy as `${string & Property}Id`]?: TId[TGroupBy[Property]];
};

type FindKeyByValue<TObject extends { [K in string]: unknown | TValue }, TValue> = {
    [K in keyof TObject]: TObject[K] extends TValue ? K : never;
}[keyof TObject];

export type GroupByForType<TGroups, TGroupBy extends BaseGroupBy<TGroups>, TType> =
    Exclude<FindKeyByValue<TGroupBy, TType>, never>;
