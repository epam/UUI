import { useEffect, useMemo, useRef } from "react";
import isEqual from "lodash.isequal";
import { useView } from "./useView";
import { UnboxListProps, UseListProps } from "./types";
import { createView, mergePropsWithDefaults } from "./helpers";
import { DataSourceState } from "../../../types";

export function useList<TItem, TId, TFilter>(
    { listState, setListState, loadData = true, ...props }: UseListProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const loadDataRef = useRef(false);
    const stateRef = useRef<DataSourceState<TFilter, TId>>(listState);

    const viewProps = mergePropsWithDefaults(props);

    const view = useView<TItem, TId, TFilter, UnboxListProps<typeof props>>(
        () => createView({ value: listState, onValueChange: setListState }, viewProps),
        (current) => {
            current.update(listState, props);
        },
        deps,
    );

    useEffect(() => {
        loadDataRef.current = loadData;
        stateRef.current = listState;
    }, [loadData, view, listState]);

    const isLoadUpdated = loadDataRef.current !== loadData && loadData;
    if (isLoadUpdated || (loadData && !isEqual(stateRef.current, listState))) {
        view.loadData();
    }

    const rows = view.getVisibleRows();
    const listProps = useMemo(() => view.getListProps(), [view, listState]);

    return {
        rows,
        listProps,
        getSelectedRows: view.getSelectedRows,
        selectAll: view.selectAll,
        getById: view.getById,
        reload: view.reload,
    };
}
