import { useEffect, useMemo, useRef } from "react";
import isEqual from "lodash.isequal";
import { useView } from "./useView";
import { UseListProps } from "./types";
import { createView, updateView, mergePropsWithDefaults } from "./helpers";
import { DataSourceState } from "../../../types";

export function useList<TItem, TId, TFilter>(
    { value, onValueChange, loadData = true, ...props }: UseListProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const loadDataRef = useRef(false);
    const valueRef = useRef<DataSourceState<TFilter, TId>>(value);

    const viewProps = mergePropsWithDefaults(props);

    const view = useView(
        () => createView({ value, onValueChange }, viewProps),
        (current) => updateView(current, value, viewProps),
        deps,
    );

    useEffect(() => {
        loadDataRef.current = loadData;
        valueRef.current = value;
    }, [loadData, view, value]);

    const isLoadUpdated = loadDataRef.current !== loadData && loadData;
    if (isLoadUpdated || (loadData && !isEqual(valueRef.current, value))) {
        view.loadData();
    }

    const rows = view.getVisibleRows();
    const listProps = useMemo(() => view.getListProps(), [view, value]);

    return {
        rows,
        listProps,
        getSelectedRows: view.getSelectedRows,
        selectAll: view.selectAll,
        getById: view.getById,
        reload: view.reload,
    };
}
