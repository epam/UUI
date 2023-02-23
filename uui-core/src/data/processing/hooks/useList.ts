import { useEffect, useMemo, useRef } from "react";
import { useView } from "./useView";
import { ListViewProps, ListViewPropsWithDefaults, UseListProps } from "./types";
import { createView, isLazyListViewProps, updateView } from "./helpers";
import { DataSourceState } from "../../../types";
import isEqual from "lodash.isequal";

export function useList<TItem, TId, TFilter>(
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

    const mergePropsWithDefaults = (props: ListViewProps<TItem, TId, TFilter>): ListViewPropsWithDefaults<TItem, TId, TFilter> => {
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

    const viewProps = mergePropsWithDefaults(props);

    const view = useView(
        () => createView({ value, onValueChange }, viewProps),
        (current) => updateView(current, value, viewProps),
        deps,
    );

    useEffect(() => {
        const isLoadUpdated = loadDataRef.current !== loadData && loadData;
        if (isLoadUpdated || (loadData && !isEqual(valueRef.current, value))) {
            view.loadData();
        }

        loadDataRef.current = loadData;
        valueRef.current = value;
    }, [loadData, view, value]);


    const rows = view.getVisibleRows();
    const listProps = useMemo(() => view.getListProps(), [view, value]);

    return {
        rows,
        listProps,
        getSelectedRows: view.getSelectedRows,
        selectAll: view.selectAll,
        getById: view.getById,
    };
}
