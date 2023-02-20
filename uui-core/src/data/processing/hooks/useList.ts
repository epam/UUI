import { ArrayDataSourceProps } from "../ArrayDataSource";
import { AsyncDataSourceProps } from "../AsyncDataSource";
import { LazyDataSourceProps } from "../LazyDataSource";

type UseListProps<TItem, TId, TFilter> =
    | LazyDataSourceProps<TItem, TId, TFilter>
    | AsyncDataSourceProps<TItem, TId, TFilter>
    | ArrayDataSourceProps<TItem, TId, TFilter>;

export function useList<TId, TItem, TFilter>(props: UseListProps<TItem, TId, TFilter>) {

}