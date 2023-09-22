import { LazyDataSourceProps } from '@epam/uui-core';
import { ID, PATH } from './constants';

export type UnboxGroupsFromUnion<TypeField extends keyof Group, Group extends { [K in TypeField]: string }> = {
    [Type in Group[TypeField] as Type]: Extract<Group, { [K in TypeField]: Type }>;
};

export type UnboxUnionFromGroups<TGroups> = TGroups[keyof TGroups];

export type UnboxArray<T extends Array<any> | any> = T extends Array<infer U> ? U : T;

export type TFilterWithGroupBy<TGroups> = {
    groupBy?: GroupByKeys<TGroups>;
};

export interface GetType<TGroups, TFilter extends { groupBy?: GroupByKeys<TGroups> }> {
    getType: (entity: UnboxUnionFromGroups<TGroups>) => keyof TGroups;
    getGroupBy: () => UnboxArray<TFilter['groupBy']> | UnboxArray<TFilter['groupBy']>[];
}

export type ConfigDefault<TGroups, TId extends { [K in keyof TGroups]: unknown }, TFilter extends { groupBy?: GroupByKeys<TGroups> }> =
    Partial<LazyDataSourceProps<UnboxUnionFromGroups<TGroups>, UnboxUnionFromGroups<ComplexId<TGroups, TId, TFilter>>[], TFilter>>
    & GetType<TGroups, TFilter>
    & {
        isLastNestingLevel?: (item: TGroups[keyof TGroups]) => boolean;
        getFilterFromGroupByPath?: (path: UnboxUnionFromGroups<ComplexId<TGroups, TId, TFilter>>[]) => TFilter,
    };

export type LazyDataSourceGetters<TItem, TId, TFilter> =
    Pick<LazyDataSourceProps<TItem, TId, TFilter>, 'getId' | 'getParentId' | 'getChildCount' | 'isFoldedByDefault'>;

type EntityLazyDataSourceProps<
    TGroups,
    TType extends keyof TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> =
    LazyDataSourceGetters<TGroups[TType], TId[TType], TFilter>
    & {
        api: (
            request: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter>['api']>[0],
            context: Parameters<LazyDataSourceProps<TGroups[keyof TGroups], TId[TType], TFilter>['api']>[1],
        ) => ReturnType<LazyDataSourceProps<TGroups[keyof TGroups], TId[TType], TFilter>['api']>;
        getRowOptions: (
            ...args: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter>['getRowOptions']>
        ) => ReturnType<LazyDataSourceProps<TGroups[keyof TGroups], UnboxUnionFromGroups<ComplexId<TGroups, TId, TFilter>>[], TFilter>['getRowOptions']>;

        isLastNestingLevel: (item: TGroups[TType]) => boolean;
    };

export type EntityConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId, TFilter>>;

export type GroupingConfig<
    TGroups,
    TType extends keyof TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId, TFilter>> & { type: TType };

export type EntitiesConfig<
    TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> = {
    [TType in keyof TGroups]?: EntityConfig<TGroups, TType, TId, TFilter>;
};

export type GroupingsConfig<
    TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> = {
    [TType in keyof TGroups]?: GroupingConfig<TGroups, TType, TId, TFilter>;
};

export type ComplexId<TGroups, TId extends { [K in keyof TGroups]: unknown }, TFilter extends TFilterWithGroupBy<TGroups>> = {
    [K in keyof TGroups]: [K, UnboxArray<TFilter['groupBy']>, TId[K]];
};

type ExtractGroupByKey<Property extends PropertyKey> = Property extends `${infer P}Id` ? P : never;

export type GroupByKey<TGroups> = {
    [K in keyof TGroups]: ExtractGroupByKey<keyof TGroups[K]>;
}[keyof TGroups];

export type GroupByKeys<TGroups> = GroupByKey<TGroups> | GroupByKey<TGroups>[];

export type FilterForGroupBy<
    TGroups,
    TId extends { [K in keyof TGroups]: unknown }
> = {
    [Key in GroupByKey<TGroups>]?: TId[keyof TId];
};

export type TGroupWithMeta<
    TGroups,
    TType extends keyof TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> = TGroups[TType] & {
    [ID]?: UnboxUnionFromGroups<ComplexId<TGroups, TId, TFilter>>[],
    [PATH]?: UnboxArray<TFilter['groupBy']>[];
};

export type TGroupsWithMeta<
    TGroups,
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> = {
    [TType in keyof TGroups]: TGroupWithMeta<TGroups, TType, TId, TFilter>;
};
