import { useMemo } from 'react';
import { LazyDataSourceApi, LazyDataSourceApiRequest, LazyDataSourceApiResponse, useLazyDataSource } from '@epam/uui-core';
import { GroupingConfigBuilder } from './groupingConfigBuilder';
import { UnboxUnionFromGroups } from './types';

type Setup<TGroups, TId, TFilter> = (
    configBuilder: GroupingConfigBuilder<TGroups, TId, TFilter>
) => GroupingConfigBuilder<TGroups, TId, TFilter>;

export function useLazyDataSourceWithGrouping<TGroups, TId, TFilter>(
    setup: Setup<TGroups, TId, TFilter>,
    deps: unknown[] = [],
) {
    const config = useMemo(
        () => setup(new GroupingConfigBuilder()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps,
    );

    const api: LazyDataSourceApi<UnboxUnionFromGroups<TGroups>, TId, TFilter> = async (request, ctx) => {
        const { ids } = request;
        if (ids != null) {
            const idsByType: { [Type in keyof TGroups]?: TId[] } = {};
            ids.forEach((id) => {
                const [type] = config.getTypeAndId(id);
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

        const groupBy = config.getGroupBy(request.filter);
        if (groupBy) {
            return config.apiByGroupBy(groupBy, request, ctx);
        }

        return config.defaultApiByGroupBy(request, ctx);
    };

    return useLazyDataSource<UnboxUnionFromGroups<TGroups>, TId, TFilter>(
        {
            ...config.getDefaultConfigProps(),
            api,
            getId: (i) => config.getId(i),
            getParentId: (i) => config.getParentId(i),
            getChildCount: (i) => config.getChildCount(i),
            getRowOptions: (...args) => config.getRowOptions(...args),
            isFoldedByDefault: (i) => config.isFoldedByDefault(i),
        },
        deps,
    );
}
