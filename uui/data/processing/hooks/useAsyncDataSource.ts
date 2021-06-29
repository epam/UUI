import { AsyncDataSource, AsyncDataSourceProps } from '../AsyncDataSource';
import { useMemoWithDestructor } from "../../../helpers/useMemoWithDestructor";

export function useAsyncDataSource<TItem, TId, TFilter >(params: AsyncDataSourceProps<TItem, TId, TFilter>, deps: any[]) {
    return useMemoWithDestructor(() => new AsyncDataSource({ ...params }), (dataSource) => dataSource.destroy, deps);
}