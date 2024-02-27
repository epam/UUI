import { DataQueryFilter, LazyDataSource, LazyDataSourceApi, LazyDataSourceProps, runDataQuery } from '@epam/uui-core';

type Props<TItem, TId, TFilter> = Omit<LazyDataSourceProps<TItem, TId, TFilter>, 'api'> & {
    api?: LazyDataSourceProps<TItem, TId, TFilter>['api'];
};

export function getLazyDataSourceMock<TItem extends { id: string }, TId, TFilter>(data: TItem[], props: Props<TItem, TId, TFilter>, delay?: number) {
    const api: LazyDataSourceApi<TItem, TId, TFilter> = props.api === undefined
        ? (request, ctx) => {
            return Promise.resolve(runDataQuery(data, ctx?.parent
                ? { ...request, filter: { ...request?.filter, parentId: ctx.parentId } as DataQueryFilter<TItem> }
                : { ...request, filter: { ...request?.filter, parentId: { isNull: true } } as DataQueryFilter<TItem> }));
        }
        : props.api;

    const apiMock = jest.fn().mockImplementation(delay === undefined
        ? api
        : (...args) => new Promise((resolve) => {
            setTimeout(async () => resolve(await api.apply(null, args)), delay);
        }));

    return { dataSource: new LazyDataSource({ ...props, api: apiMock }), apiMock };
}
