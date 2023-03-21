import { ArrayListView, AsyncListView, LazyListView } from "../views";
import { DataSourceState, IEditable } from "../../../types";
import { AsyncListProps, IView, LazyListProps, ListViewProps } from "./types";

export const isLazyListViewProps = <TItem, TId, TFilter, TSubtotals = void>(props: ListViewProps<TItem, TId, TFilter, TSubtotals>):
    props is LazyListProps<TItem, TId, TFilter, TSubtotals> =>
    props.type === 'lazy';

export const isAsyncListViewProps = <TItem, TId, TFilter, TSubtotals = void>(props: ListViewProps<TItem, TId, TFilter, TSubtotals>):
    props is AsyncListProps<TItem, TId, TFilter, TSubtotals> =>
    props.type === 'async';

export const createView = <TItem, TId, TFilter, TSubtotals, Props extends ListViewProps<TItem, TId, TFilter, TSubtotals>>(
    editable: IEditable<DataSourceState<TFilter, TId>>,
    props: Props,
): IView<TItem, TId, TFilter, TSubtotals, Props> => {
    if (isLazyListViewProps<TItem, TId, TFilter, TSubtotals>(props)) {
        const { type, ...viewProps } = props;
        return new LazyListView(editable, viewProps) as IView<TItem, TId, TFilter, TSubtotals, Props>;
    }

    if (isAsyncListViewProps<TItem, TId, TFilter, TSubtotals>(props)) {
        const { type, ...viewProps } = props;
        return new AsyncListView<TItem, TId, TFilter, TSubtotals>(editable, viewProps);
    }

    const { type, ...viewProps } = props;
    return new ArrayListView<TItem, TId, TFilter, TSubtotals>(editable, viewProps);
};

export const mergePropsWithDefaults = <TItem, TId, TFilter, TSubtotals = void>(
    props: ListViewProps<TItem, TId, TFilter, TSubtotals>,
): ListViewProps<TItem, TId, TFilter, TSubtotals> => {
    if (isLazyListViewProps(props)) {
        return {
            ...props,
            legacyLoadDataBehavior: props.legacyLoadDataBehavior ?? false,
        };
    }

    return props;
};
