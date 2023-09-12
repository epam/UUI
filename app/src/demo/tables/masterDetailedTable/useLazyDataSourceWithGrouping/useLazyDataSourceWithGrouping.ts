import { useMemo } from 'react';
import { LazyDataSourceApi, LazyDataSourceApiRequest, LazyDataSourceApiResponse } from '@epam/uui-core';
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
        const { ids, filter: requestFilter, ...rq } = request;
        if (ids != null) {
            const idsByType: Record<keyof TGroups, TId[]> = {} as any;

            ids.forEach((id) => {
                const [type] = config.getTypeAndId(id);
                idsByType[type] = idsByType[type] || [];
                idsByType[type].push(id);
            });

            const typesToLoad = Object.keys(idsByType) as Array<keyof TGroups>
            const response: LazyDataSourceApiResponse<UnboxUnionFromGroups<TGroups>> = { items: [] };

            const promises = typesToLoad.map(async (type) => {
                const idsRequest: LazyDataSourceApiRequest<any, any, TFilter> = { ids: idsByType[type] };
                const apiResponse = await config.api(type, idsRequest);
                response.items = [...response.items, ...apiResponse.items];
            });

            await Promise.all(promises);
            return response;
        }
    };
}
