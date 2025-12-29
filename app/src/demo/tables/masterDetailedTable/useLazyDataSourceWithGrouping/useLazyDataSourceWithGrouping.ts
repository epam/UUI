import { useMemo } from 'react';
import { LazyDataSourceApi, useLazyDataSource } from '@epam/uui-core';
import { GroupingConfigBuilder } from './groupingConfigBuilder';
import { BaseGroups, BaseGroupsIds, ComplexId, BaseFilter, TGroupsWithMeta, ToUnion, BaseGroupBy } from './types';

type Setup<
    TGroups extends BaseGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>,
> = (
    configBuilder: GroupingConfigBuilder<TGroups, TId, TFilter, TGroupBy>,
) => GroupingConfigBuilder<TGroups, TId, TFilter, TGroupBy>;

export function useLazyDataSourceWithGrouping<
    TGroups extends BaseGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>,
>(
    setup: Setup<TGroups, TId, TFilter, TGroupBy>,
    deps: unknown[] = [],
) {
    const config = useMemo(
        () => setup(new GroupingConfigBuilder()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps,
    );
    const api: LazyDataSourceApi<
    ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>,
    ToUnion<ComplexId<TGroups, TId, TGroupBy>>[],
    TFilter[keyof TGroups]
    > = async (request, ctx) => {
        const groupBy = config.getGroupBy();

        const { ids, ...rq } = request;
        if (ids != null) {
            return config.idsApi({ ids }, groupBy, ctx);
        }

        const pathIds = ctx?.parentId ?? [];
        const [, , parentId] = pathIds.length ? pathIds[pathIds.length - 1] : [];

        if (groupBy && !(Array.isArray(groupBy) && !groupBy.length)) {
            return config.groupByApi(groupBy, rq, { ...ctx, parentId });
        }

        return config.entityApi(rq, { ...ctx, parentId });
    };

    return useLazyDataSource<
    ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>,
    ToUnion<ComplexId<TGroups, TId, TGroupBy>>[],
    TFilter[keyof TGroups]
    >(
        {
            ...config.getDefaultConfigProps(),
            complexIds: true,
            api,
            getId: (i) => config.getId(i),
            getParentId: (i) => config.getParentId(i),
            getChildCount: (i) => config.getChildCount(i),
            getRowOptions: (i, index) => config.getRowOptions(i, index),
        },
        deps,
    );
}
