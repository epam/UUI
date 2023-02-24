import { useEffect, useMemo, useRef } from "react";
import isEqual from "lodash.isequal";
import { useView } from "./useView";
import { UnboxListProps, UseListProps } from "./types";
import { createView, mergePropsWithDefaults } from "./helpers";
import { DataSourceState } from "../../../types";

export function useList<TItem, TId, TFilter>(
    { state, setState, loadData = true, ...props }: UseListProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const loadDataRef = useRef(false);
    const stateRef = useRef<DataSourceState<TFilter, TId>>(state);

    const viewProps = mergePropsWithDefaults(props);

    const view = useView<TItem, TId, TFilter, UnboxListProps<typeof props>>(
        () => createView({ value: state, onValueChange: setState }, viewProps),
        (current) => {
            current.update(state, props);
        },
        deps,
    );

    useEffect(() => {
        loadDataRef.current = loadData;
        stateRef.current = state;
    }, [loadData, view, state]);

    const isLoadUpdated = loadDataRef.current !== loadData && loadData;
    if (isLoadUpdated || (loadData && !isEqual(stateRef.current, state))) {
        view.loadData();
    }

    const rows = view.getVisibleRows();
    const listProps = useMemo(() => view.getListProps(), [view, state]);

    return {
        rows,
        listProps,
        getSelectedRows: view.getSelectedRows,
        selectAll: view.selectAll,
        getById: view.getById,
        reload: view.reload,
    };
}
