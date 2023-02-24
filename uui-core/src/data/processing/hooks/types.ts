import { ArrayListView, ArrayListViewProps, AsyncListView, AsyncListViewProps, LazyListView, LazyListViewProps } from "../views";
import { DataSourceState } from "../../../types";

export type ListView<TItem, TId, TFilter> =
    | ArrayListView<TItem, TId, TFilter>
    | AsyncListView<TItem, TId, TFilter>
    | LazyListView<TItem, TId, TFilter>;

export type PropsWithType<Props, Type extends string> = Props & { type: Type };

export type LazyListProps<TItem, TId, TFilter> = PropsWithType<LazyListViewProps<TItem, TId, TFilter>, 'lazy'>;
export type AsyncListProps<TItem, TId, TFilter> = PropsWithType<AsyncListViewProps<TItem, TId, TFilter>, 'async'>;
export type ArrayListProps<TItem, TId, TFilter> = PropsWithType<ArrayListViewProps<TItem, TId, TFilter>, 'array'>;

export type ListViewProps<TItem, TId, TFilter> =
    | LazyListProps<TItem, TId, TFilter>
    | AsyncListProps<TItem, TId, TFilter>
    | ArrayListProps<TItem, TId, TFilter>;

export type ListViewPropsWithDefaults<TItem, TId, TFilter> = (
    | LazyListProps<TItem, TId, TFilter>
    | AsyncListProps<TItem, TId, TFilter>
    | ArrayListProps<TItem, TId, TFilter>
) & {
    getId: Exclude<ListViewProps<TItem, TId, TFilter>['getId'], undefined>;
    getParentId: Exclude<ListViewProps<TItem, TId, TFilter>['getParentId'], undefined>;
};

interface ListState<TId, TFilter> {
    state: DataSourceState<TFilter, TId>;
    setState: (state: DataSourceState<TFilter, TId>) => void;
}

export type UseListProps<TItem, TId, TFilter> = ListViewProps<TItem, TId, TFilter> & ListState<TId, TFilter> & {
    /**
     * If data loading has to be postponed, this flag has to be set to false.
     * Changing the flag to `true` will trigger data loading.
     * @default true
     */
    loadData?: boolean;
};
