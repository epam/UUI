import { ArrayListViewProps, AsyncListViewProps, LazyListViewProps } from "../views";

type UseListProps<TItem, TId, TFilter> =
    | LazyListViewProps<TItem, TId, TFilter>
    | AsyncListViewProps<TItem, TId, TFilter>
    | ArrayListViewProps<TItem, TId, TFilter>;

export function useList<TId, TItem, TFilter>(props: UseListProps<TItem, TId, TFilter>) {

}
