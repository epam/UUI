import { useEffect, useMemo, useRef } from "react";
import { useView } from "./useView";
import { ListViewHookProps, ListViewProps, UseListProps } from "./types";
import { createListView, updateView } from "./helpers";

export function useList<TId, TItem, TFilter>(
    { value, onValueChange, loadData, ...props }: UseListProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const loadDataRef = useRef(false);
    const valueRef = useRef(value);

    const getId = (item: TItem & { id?: TId }) => {
        if (item == null) return null;
        const id = props.getId?.(item) || item.id;
        if (id == null) {
            throw new Error(`Item ID not found. Check 'getId' prop value. Item: ${ JSON.stringify(item) }`);
        }
        return id;
    };

    const defaultGetParentId = (item: TItem): TId => (item as any)['parentId'];

    const mergePropsWithDefault = (props: ListViewHookProps<TItem, TId, TFilter>): ListViewProps<TItem, TId, TFilter> =>
        ({ ...props, getId: props.getId ?? getId, getParentId: props.getParentId ?? defaultGetParentId });

    const viewProps = useMemo(() => mergePropsWithDefault(props), []);

    const view = useView(
        () => createListView({ value, onValueChange }, viewProps),
        deps,
    );

    useEffect(() => {
        if (loadDataRef.current !== loadData && loadData || valueRef.current !== value) {
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
