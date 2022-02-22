import { AsyncDataSource, AsyncDataSourceProps } from '../AsyncDataSource';
import { useMemoWithDestructor } from "../../../helpers/useMemoWithDestructor";
import { DataSourceItemId } from '..';

export function useAsyncDataSource<TItem, TId extends DataSourceItemId, TFilter >(params: AsyncDataSourceProps<TItem, TId, TFilter>, deps: any[]) {
    return useMemoWithDestructor(() => new AsyncDataSource({ ...params }), (dataSource) => dataSource.destroy(), deps);
}