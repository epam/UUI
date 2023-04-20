import { useEffect, useMemo, useRef } from 'react';
import { useView } from './useView';
import { UnboxListProps, UseListProps } from './types';
import { createView, mergePropsWithDefaults } from './helpers';
import { usePrevious } from '../../../../src/hooks';
import isEqual from 'lodash.isequal';

export function useList<TItem, TId, TFilter>({ listState, setListState, loadData = true, ...props }: UseListProps<TItem, TId, TFilter>, deps: any[]) {
    const prevLoadDataRef = useRef(false);
    const prevListState = usePrevious(listState);

    useEffect(() => {
        prevLoadDataRef.current = loadData;
    });

    const viewProps = mergePropsWithDefaults(props);

    const view = useView<TItem, TId, TFilter, UnboxListProps<typeof props>>(
        () => createView({ value: listState, onValueChange: setListState }, viewProps),
        (current) => {
            current.update(listState, props);
        },
        deps
    );

    const isLoadUpdated = prevLoadDataRef.current !== loadData && loadData;
    if (isLoadUpdated || (loadData && !isEqual(prevListState, listState))) {
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
