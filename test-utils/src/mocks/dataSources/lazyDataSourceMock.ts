import { DataQueryFilter, LazyDataSource, LazyDataSourceApi, LazyDataSourceProps, runDataQuery } from '@epam/uui-core';
import { delay } from '../../rendering/timerUtils';

type Props<TItem, TId, TFilter> = Omit<LazyDataSourceProps<TItem, TId, TFilter>, 'api'> & {
    api?: LazyDataSourceProps<TItem, TId, TFilter>['api'];
};

export function getLazyDataSourceMock<TItem extends { id: string }, TId, TFilter>(data: TItem[], props: Props<TItem, TId, TFilter>, delayTime?: number) {
    const api: LazyDataSourceApi<TItem, TId, TFilter> = props.api === undefined
        ? (request, ctx) => {
            let query;
            if (ctx?.parent) {
                query = { ...request, filter: { parentId: ctx.parentId, ...request?.filter } as DataQueryFilter<TItem> };
            } else {
                if (request.search) {
                    query = request;
                } else {
                    query = { ...request, filter: { parentId: { isNull: true }, ...request?.filter } as DataQueryFilter<TItem> };
                }
            }
            return Promise.resolve(runDataQuery(data, query));
        }
        : props.api;

    const apiMock = jest.fn().mockImplementation(
        delayTime === undefined
            ? api
            : async (request, ctx) => {
                await delay(delayTime);
                return await api(request, ctx);
            },
    );

    return { dataSource: new LazyDataSource({ ...props, api: apiMock }), apiMock };
}
