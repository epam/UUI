import { ArrayListView, AsyncListView, LazyListView } from "../views";
import { DataSourceState, IEditable } from "../../../types";
import { AsyncListProps, IView, LazyListProps, ListViewProps } from "./types";

export const isLazyListViewProps = <TItem, TId, TFilter>(props: ListViewProps<TItem, TId, TFilter>):
    props is LazyListProps<TItem, TId, TFilter> =>
    props.type === 'lazy';

export const isAsyncListViewProps = <TItem, TId, TFilter>(props: ListViewProps<TItem, TId, TFilter>):
    props is AsyncListProps<TItem, TId, TFilter> =>
    props.type === 'async';

export const createView = <TItem, TId, TFilter, Props extends ListViewProps<TItem, TId, TFilter>>(
    editable: IEditable<DataSourceState<TFilter, TId>>,
    props: Props,
): IView<TItem, TId, TFilter, Props> => {
    if (isLazyListViewProps(props)) {
        const { type, ...viewProps } = props;
        return new LazyListView(editable, viewProps) as IView<TItem, TId, TFilter, Props>;
    }

    if (isAsyncListViewProps(props)) {
        const { type, ...viewProps } = props;
        return new AsyncListView(editable, viewProps);
    }

    const { type, ...viewProps } = props;
    return new ArrayListView(editable, viewProps);
};

export const mergePropsWithDefaults = <TItem, TId, TFilter>(
    props: ListViewProps<TItem, TId, TFilter>,
): ListViewProps<TItem, TId, TFilter> => {
    if (isLazyListViewProps(props)) {
        return {
            ...props,
            legacyLoadDataBehavior: props.legacyLoadDataBehavior ?? false,
        };
    }

    return props;
};
