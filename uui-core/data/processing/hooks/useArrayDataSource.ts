import { ArrayDataSource, ArrayDataSourceProps } from '../ArrayDataSource';
import { useMemoWithDestructor } from "../../../helpers/useMemoWithDestructor";
import { DataSourceItemId } from '..';

export function useArrayDataSource<TItem, TId extends DataSourceItemId, TFilter>(params: ArrayDataSourceProps<TItem, TId, TFilter>, deps: any[]) {
    return useMemoWithDestructor(() => new ArrayDataSource({ ...params }), (dataSource) => dataSource.destroy(), deps);
}