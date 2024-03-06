import { DataQueryFilter, LazyDataSource, LazyDataSourceApi, LazyDataSourceProps, runDataQuery } from '@epam/uui-core';
import { delay } from '../../rendering/timerUtils';

type Props<TItem, TId, TFilter> = Omit<LazyDataSourceProps<TItem, TId, TFilter>, 'api'> & {
    api?: LazyDataSourceProps<TItem, TId, TFilter>['api'];
};

export const getApiMock = <TItem extends { id: string }, TId, TFilter>(
    data: TItem[],
    api?: LazyDataSourceApi<TItem, TId, TFilter> | undefined,
    delayTime: number = undefined,
) => {
    const currentApi: LazyDataSourceApi<TItem, TId, TFilter> = api === undefined
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
        : api;

    const apiMock = jest.fn().mockImplementation(
        delayTime === undefined
            ? currentApi
            : async (request, ctx) => {
                await delay(delayTime);
                return await currentApi(request, ctx);
            },
    );

    return apiMock;
};

export function getLazyDataSourceMock<TItem extends { id: string }, TId, TFilter>(data: TItem[], props: Props<TItem, TId, TFilter>, delayTime?: number) {
    const apiMock = getApiMock(data, props.api, delayTime);
    return { dataSource: new LazyDataSource({ ...props, api: apiMock }), apiMock };
}
