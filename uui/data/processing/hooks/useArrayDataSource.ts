import { ArrayDataSource, ArrayDataSourceProps } from '../ArrayDataSource';
import { useMemoWithDestructor } from "../../../helpers/useMemoWithDestructor";

export function useArrayDataSource<TItem, TId, TFilter>(params: ArrayDataSourceProps<TItem, TId, TFilter>, deps: any[]) {
    return useMemoWithDestructor(() => new ArrayDataSource({ ...params }), (dataSource) => dataSource.destroy, deps);
}