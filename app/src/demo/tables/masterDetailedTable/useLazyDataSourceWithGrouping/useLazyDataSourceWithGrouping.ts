import { useMemo } from 'react';
import { LazyDataSourceApi, LazyDataSourceApiRequest, LazyDataSourceApiResponse, useLazyDataSource } from '@epam/uui-core';
import { GroupingConfigBuilder } from './groupingConfigBuilder';
import { ComplexId, GroupByKeys, UnboxUnionFromGroups } from './types';

type Setup<TGroups extends { [k in string]: {} }, TId extends { [K in keyof TGroups]: unknown }, TFilter extends { groupBy: GroupByKeys<TGroups> }> = (
    configBuilder: GroupingConfigBuilder<TGroups, TId, TFilter>,
) => GroupingConfigBuilder<TGroups, TId, TFilter>;

export function useLazyDataSourceWithGrouping<
    TGroups extends { [k in string]: {} },
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy: GroupByKeys<TGroups> }
>(
    setup: Setup<TGroups, TId, TFilter>,
    deps: unknown[] = [],
) {
    const config = useMemo(
        () => setup(new GroupingConfigBuilder()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps,
    );

    const api: LazyDataSourceApi<UnboxUnionFromGroups<TGroups>, UnboxUnionFromGroups<ComplexId<TGroups, TId>>, TFilter> = async (request, ctx) => {
        const { ids, ...rq } = request;
        if (ids != null) {
            const idsByType: { [Type in keyof TGroups]?: Array<TId[keyof TGroups]> } = {};
            ids.forEach(([type, id]) => {
                idsByType[type] = idsByType[type] || [];
                idsByType[type].push(id);
            });

            const typesToLoad = Object.keys(idsByType) as Array<keyof TGroups>;
            const response: LazyDataSourceApiResponse<UnboxUnionFromGroups<TGroups>> = { items: [] };

            const promises = typesToLoad.map(async (type) => {
                const idsRequest: LazyDataSourceApiRequest<any, any, TFilter> = { ids: idsByType[type] };
                const apiResponse = await config.api(type, idsRequest);
                response.items = [...response.items, ...apiResponse.items];
            });

            await Promise.all(promises);
            return response;
        }

        const [, parentId] = ctx.parentId ?? [];
        if (request.search) {
            return config.defaultApi(rq, { ...ctx, parentId });
        }
        const groupBy = config.getGroupBy();
        if (groupBy) {
            return config.apiByGroupBy(groupBy, rq, { ...ctx, parentId });
        }

        return config.defaultApi(rq, { ...ctx, parentId });
    };

    return useLazyDataSource<UnboxUnionFromGroups<TGroups>, UnboxUnionFromGroups<ComplexId<TGroups, TId>>, TFilter>(
        {
            ...config.getDefaultConfigProps(),
            api,
            getId: (i) => config.getId(i),
            getParentId: (i) => config.getParentId(i),
            getChildCount: (i) => config.getChildCount(i),
        },
        deps,
    );
}
