import { ArrayListView, AsyncListView, LazyListView } from "../views";
import { DataSourceState, IEditable } from "../../../types";
import { AsyncListProps, LazyListProps, ListView, ListViewProps, ListViewPropsWithDefaults } from "./types";

export const isLazyListViewProps = <TId, TItem, TFilter>(props: ListViewProps<TItem, TId, TFilter>):
    props is LazyListProps<TItem, TId, TFilter> =>
    props.type === 'lazy';

export const isAsyncListViewProps = <TId, TItem, TFilter>(props: ListViewProps<TItem, TId, TFilter>):
    props is AsyncListProps<TItem, TId, TFilter> =>
    props.type === 'async';

export const createView = <TId, TItem, TFilter>(
    editable: IEditable<DataSourceState<TFilter, TId>>,
    props: ListViewPropsWithDefaults<TItem, TId, TFilter>,
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
    props: ListViewPropsWithDefaults<TItem, TId, TFilter>,
) => {
    if (isLazyListViewProps(props) && view instanceof LazyListView) {
        const { type, ...viewProps } = props;
        view.update(value, viewProps);
    }

    if (
        (isAsyncListViewProps(props) && view instanceof AsyncListView)
        || view instanceof ArrayListView
    ) {
        const { type, ...viewProps } = props;
        view.update(value, viewProps);
    }
};

export const mergePropsWithDefaults = <TItem, TId, TFilter>(
    props: ListViewProps<TItem, TId, TFilter>,
): ListViewPropsWithDefaults<TItem, TId, TFilter> => {
    const getId = (item: TItem & { id?: TId }) => {
        if (item == null) return null;
        const id = props.getId?.(item) || item.id;
        if (id == null) {
            throw new Error(`Item ID not found. Check 'getId' prop value. Item: ${ JSON.stringify(item) }`);
        }
        return id;
    };

    const defaultGetParentId = (item: TItem): TId => (item as any)['parentId'];

    const viewProps: ListViewPropsWithDefaults<TItem, TId, TFilter> = {
        ...props,
        getId: props.getId ?? getId,
        getParentId: props.getParentId ?? defaultGetParentId,
    };
    if (isLazyListViewProps(viewProps)) {
        return {
            ...viewProps,
            legacyLoadDataBehavior: viewProps.legacyLoadDataBehavior ?? false,
        };
    }

    return viewProps;
};
