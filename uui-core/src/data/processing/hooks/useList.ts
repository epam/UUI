import { useMemo } from "react";
import { useView } from "./useView";
import { ArrayListProps, UnboxListProps, UseListProps } from "./types";
import { createView, mergePropsWithDefaults } from "./helpers";
import { usePrevious } from "../../../../src/hooks";
import { Tree } from "../views";

export function useList<TItem, TId, TFilter, TSubtotals = void>(
    { listState, setListState, loadData = true, subtotals, ...props }: UseListProps<TItem, TId, TFilter, TSubtotals>,
    deps: any[],
) {
    const prevLoadData = usePrevious(false);
    const prevListState = usePrevious(listState);

    let viewProps = mergePropsWithDefaults<TItem, TId, TFilter, TSubtotals>(props);

    if (props.type === 'array' && props.items instanceof Tree) {
        const treeWithSubtotals = props.items.withSubtotals(subtotals);
        viewProps = { ...viewProps, items: treeWithSubtotals } as ArrayListProps<TItem, TId, TFilter, TSubtotals>;
    }

    const view = useView<TItem, TId, TFilter, TSubtotals, UnboxListProps<typeof props>>(
        () => createView({ value: listState, onValueChange: setListState }, viewProps),
        (current) => {
            current.update(listState, viewProps);
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
