import { ArrayListView, ArrayListViewProps, AsyncListView, AsyncListViewProps, LazyListView, LazyListViewProps } from "../views";
import { DataSourceState, IEditable } from "../../../types";

export type ListView<TItem, TId, TFilter> =
    | ArrayListView<TItem, TId, TFilter>
    | AsyncListView<TItem, TId, TFilter>
    | LazyListView<TItem, TId, TFilter>;

export type UseLazyListProps<TItem, TId, TFilter> = LazyListViewProps<TItem, TId, TFilter> & { type: 'lazy' };

export type ListViewHookProps<TItem, TId, TFilter> =
    | UseLazyListProps<TItem, TId, TFilter>
    | AsyncListViewProps<TItem, TId, TFilter>
    | ArrayListViewProps<TItem, TId, TFilter>;

export type ListViewProps<TItem, TId, TFilter> =
    | LazyListViewProps<TItem, TId, TFilter>
    | AsyncListViewProps<TItem, TId, TFilter>
    | ArrayListViewProps<TItem, TId, TFilter>;

export type UseListProps<TItem, TId, TFilter> = ListViewHookProps<TItem, TId, TFilter> & IEditable<DataSourceState<TFilter, TId>> & {
    loadData?: boolean;
};
