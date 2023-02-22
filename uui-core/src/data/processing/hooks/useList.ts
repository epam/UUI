import { useEffect, useMemo, useRef } from "react";
import { useView } from "./useView";
import { ListViewHookProps, ListViewProps, UseListProps } from "./types";
import { createListView, isLazyListViewProps, updateView } from "./helpers";
import { DataSourceState } from "../../../types";
import isEqual from "lodash.isequal";

export function useList<TId, TItem, TFilter>(
    { value, onValueChange, loadData, ...props }: UseListProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const loadDataRef = useRef(false);
    const valueRef = useRef<DataSourceState<TFilter, TId>>(value);

    const getId = (item: TItem & { id?: TId }) => {
        if (item == null) return null;
        const id = props.getId?.(item) || item.id;
        if (id == null) {
            throw new Error(`Item ID not found. Check 'getId' prop value. Item: ${ JSON.stringify(item) }`);
        }
        return id;
    };

    const defaultGetParentId = (item: TItem): TId => (item as any)['parentId'];

    const mergePropsWithDefaults = (props: ListViewHookProps<TItem, TId, TFilter>): ListViewProps<TItem, TId, TFilter> => {
        const viewProps = {
            ...props,
            getId: props.getId ?? getId,
            getParentId: props.getParentId ?? defaultGetParentId,
        };
        if (isLazyListViewProps(props)) {
            return {
                ...viewProps,
                loadDataOnGetVisualRows: props.loadDataOnGetVisualRows ?? false,
            };
        }
        return viewProps;
    };

    const viewProps = mergePropsWithDefaults(props);
    const view = useView(
        () => createListView({ value, onValueChange }, viewProps),
        deps,
    );

    useEffect(() => {
        const isLoadUpdated = loadDataRef.current !== loadData && loadData;
        if (isLoadUpdated || (loadData && !isEqual(valueRef.current, value))) {
            updateView(view, value, viewProps);
        }
        loadDataRef.current = loadData;
        valueRef.current = value;
    }, [loadData, view, value]);

    const rows = useMemo(() => view.getVisibleRows(), [view, value]);
    const listProps = useMemo(() => view.getListProps(), [view, value]);
    const selectedRows = useMemo(() => view.getSelectedRows(), [view, value]);

    return useMemo(
        () => ({ view, rows, selectedRows, ...listProps }),
        [view, rows, selectedRows, listProps],
    );
}
