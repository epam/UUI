import { LazyDataSource, LazyDataSourceProps } from '../LazyDataSource';
import { useMemoWithDestructor } from "../../../helpers/useMemoWithDestructor";
import { DataSourceItemId } from '../../../types';

export function useLazyDataSource<TItem, TId extends DataSourceItemId, TFilter>(props: LazyDataSourceProps<TItem, TId, TFilter>, deps: any[]) {
    return useMemoWithDestructor(
        () => new LazyDataSource({ ...props}),
        (dataSource) => dataSource.setProps(props),
        (dataSource) => dataSource.destroy(),
        deps
    );
}