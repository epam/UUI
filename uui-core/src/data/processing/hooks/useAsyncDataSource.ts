import { AsyncDataSource, AsyncDataSourceProps } from '../AsyncDataSource';
import { useMemoWithDestructor } from '../../../helpers/useMemoWithDestructor';

export function useAsyncDataSource<TItem, TId, TFilter>(props: AsyncDataSourceProps<TItem, TId, TFilter>, deps: any[]) {
    return useMemoWithDestructor(
        () => new AsyncDataSource({ ...props }),
        (dataSource) => dataSource.setProps(props as any /* due to broken inheritance of AsyncDataSource from ArrayDataSource */),
        (dataSource) => dataSource.destroy(),
        deps,
    );
}
