import { ArrayListView, AsyncListView, AsyncListViewProps, LazyListView } from "../views";
import { DataSourceState, IEditable } from "../../../types";
import { ListView, ListViewHookProps, UseLazyListProps } from "./types";

export const isLazyListViewProps = <TId, TItem, TFilter>(
    props: ListViewHookProps<TItem, TId, TFilter>,
): props is UseLazyListProps<TItem, TId, TFilter> =>
    'api' in props && (props as UseLazyListProps<TItem, TId, TFilter>).type === 'lazy';

export const isAsyncListViewProps = <TId, TItem, TFilter>(
    props: ListViewHookProps<TItem, TId, TFilter>,
): props is AsyncListViewProps<TItem, TId, TFilter> => 'api' in props;

export const createListView = <TId, TItem, TFilter>(
    editable: IEditable<DataSourceState<TFilter, TId>>,
    props: ListViewHookProps<TItem, TId, TFilter>,
) => {
    if (isLazyListViewProps(props)) {
        const { type, ...viewProps } = props;
        return new LazyListView(editable, viewProps);
    }

    if (isAsyncListViewProps(props)) {
        return new AsyncListView(editable, props);
    }

    return new ArrayListView(editable, props);
};

export const updateView = <TId, TItem, TFilter>(
    view: ListView<TItem, TId, TFilter>,
    value: DataSourceState<TFilter, TId>,
    props: ListViewHookProps<TItem, TId, TFilter>,
) => {
    if (isLazyListViewProps(props) && view instanceof LazyListView) {
        const { type, ...viewProps } = props;
        view.update(value, viewProps);
    }
    if ((isAsyncListViewProps(props) && view instanceof AsyncListView) || view instanceof ArrayListView) {
        view.update(value, props);
    }

    view.loadData();
};
