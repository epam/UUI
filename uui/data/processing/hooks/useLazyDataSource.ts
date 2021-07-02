import { LazyDataSource, LazyDataSourceProps } from '../LazyDataSource';
import { useMemoWithDestructor } from "../../../helpers/useMemoWithDestructor";

export function useLazyDataSource<TItem, TId, TFilter>(params: LazyDataSourceProps<TItem, TId, TFilter>, deps: any[]) {
    return useMemoWithDestructor(() => new LazyDataSource({ ...params}), (dataSource) => dataSource.destroy(), deps);
}