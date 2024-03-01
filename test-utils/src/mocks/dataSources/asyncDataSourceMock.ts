import { AsyncDataSource, AsyncDataSourceProps } from '@epam/uui-core';

type Props<TItem, TId, TFilter> = Omit<AsyncDataSourceProps<TItem, TId, TFilter>, 'api'>;

export function getAsyncDataSourceMock<TItem extends { id: string }, TId, TFilter>(data: TItem[], props: Props<TItem, TId, TFilter>) {
    const api = () => Promise.resolve(data);
    const apiMock = jest.fn().mockImplementation(api);
    return { dataSource: new AsyncDataSource({ ...props, api: apiMock }), apiMock };
}
