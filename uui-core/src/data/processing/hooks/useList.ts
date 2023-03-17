import { useMemo } from "react";
import { useView } from "./useView";
import { UnboxListProps, UseListProps } from "./types";
import { createView, mergePropsWithDefaults } from "./helpers";
import { usePrevious } from "../../../../src/hooks";

export function useList<TItem, TId, TFilter, TSubtotals>(
    { listState, setListState, loadData = true, ...props }: UseListProps<TItem, TId, TFilter, TSubtotals>,
    deps: any[],
) {
    const prevLoadData = usePrevious(false);
    const prevListState = usePrevious(listState);

    const viewProps = mergePropsWithDefaults(props);

    const view = useView<TItem, TId, TFilter, UnboxListProps<typeof props>>(
        () => createView({ value: listState, onValueChange: setListState }, viewProps),
        (current) => {
            current.update(listState, props);
        },
        deps,
    );

    const isLoadUpdated = prevLoadData !== loadData && loadData;
    if (isLoadUpdated || (loadData && prevListState !== listState)) {
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
