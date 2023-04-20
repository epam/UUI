import { ArrayDataSource, ArrayDataSourceProps } from '../ArrayDataSource';
import { useMemoWithDestructor } from '../../../helpers/useMemoWithDestructor';

export function useArrayDataSource<TItem, TId, TFilter>(props: ArrayDataSourceProps<TItem, TId, TFilter>, deps: any[]) {
    return useMemoWithDestructor(
        () => new ArrayDataSource({ ...props }),
        (dataSource) => dataSource.setProps(props),
        (dataSource) => dataSource.destroy(),
        deps,
    );
}
