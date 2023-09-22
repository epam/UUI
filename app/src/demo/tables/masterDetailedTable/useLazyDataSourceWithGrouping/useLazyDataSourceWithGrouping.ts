import { useMemo } from 'react';
import { LazyDataSourceApi, LazyDataSourceApiRequest, LazyDataSourceApiResponse, useLazyDataSource } from '@epam/uui-core';
import { GroupingConfigBuilder } from './groupingConfigBuilder';
import { BaseGroups, BaseGroupsIds, ComplexId, BaseFilter, TGroupsWithMeta, ToUnion } from './types';

type Setup<
    TGroups extends BaseGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
> = (
    configBuilder: GroupingConfigBuilder<TGroups, TId, TFilter>,
) => GroupingConfigBuilder<TGroups, TId, TFilter>;

export function useLazyDataSourceWithGrouping<
    TGroups extends BaseGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups>
>(
    setup: Setup<TGroups, TId, TFilter>,
    deps: unknown[] = [],
) {
    const config = useMemo(
        () => setup(new GroupingConfigBuilder<TGroups, TId, TFilter>()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps,
    );
    const api: LazyDataSourceApi<
    ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>,
    ToUnion<ComplexId<TGroups, TId, TFilter>>[],
    TFilter
    > = async (request, ctx) => {
        const { ids, ...rq } = request;
        if (ids != null) {
            const idsByType: { [Type in keyof TGroups]?: Array<TId[keyof TGroups]> } = {};
            ids.forEach((fullId) => {
                const [type, , id] = fullId[fullId.length - 1];
                idsByType[type] = idsByType[type] ?? [];
                idsByType[type].push(id);
            });

            const typesToLoad = Object.keys(idsByType) as Array<keyof TGroups>;
            const response: LazyDataSourceApiResponse<ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>> = { items: [] };

            const promises = typesToLoad.map(async (type) => {
                const idsRequest: LazyDataSourceApiRequest<any, any, TFilter> = { ids: idsByType[type] };
                const apiResponse = await config.api(type, idsRequest);
                response.items = [...response.items, ...apiResponse.items];
            });

            await Promise.all(promises);
            return response;
        }

        const pathIds = ctx.parentId ?? [];
        const [, , parentId] = pathIds.length ? pathIds[pathIds.length - 1] : [];

        // TODO: write logic for search...

        const groupBy = config.getGroupBy();
        if (groupBy && !(Array.isArray(groupBy) && !groupBy.length)) {
            return config.apiByGroupBy(groupBy, rq, { ...ctx, parentId });
        }

        return config.defaultApi(rq, { ...ctx, parentId });
    };

    return useLazyDataSource<
    ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>,
    ToUnion<ComplexId<TGroups, TId, TFilter>>[],
    TFilter
    >(
        {
            ...config.getDefaultConfigProps(),
            api,
            getId: (i) => config.getId(i),
            getParentId: (i) => config.getParentId(i),
            getChildCount: (i) => config.getChildCount(i),
            getRowOptions: (i, index) => config.getRowOptions(i, index),
        },
        deps,
    );
}
