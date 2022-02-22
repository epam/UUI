import { LazyDataSource, LazyDataSourceProps } from '../LazyDataSource';
import { useMemoWithDestructor } from "../../../helpers/useMemoWithDestructor";
import { DataSourceItemId } from '..';

export function useLazyDataSource<TItem, TId extends DataSourceItemId, TFilter>(params: LazyDataSourceProps<TItem, TId, TFilter>, deps: any[]) {
    return useMemoWithDestructor(() => new LazyDataSource({ ...params}), (dataSource) => dataSource.destroy(), deps);
}