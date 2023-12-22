import { useMemo } from 'react';
import { useView } from './useView';
import { ListViewProps, UnboxListProps, UseListOptionsProps, UseListProps } from './types';
import { createView } from './helpers';

function useListOptions<TItem, TId, TFilter, TProps extends ListViewProps<TItem, TId, TFilter>>({
    view, listState, props,
}: UseListOptionsProps<TItem, TId, TFilter, TProps>) {
    const deps: unknown[] = [view, listState];
    if (props.type === 'array') {
        deps.push(
            Array.isArray(props.items)
                ? props.items.length
                : props.items,
        );
    }

    return useMemo(() => view.getListProps(), deps);
}

export function useList<TItem, TId, TFilter>(
    { listState, setListState, activate = true, ...props }: UseListProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const viewProps = { ...props, activate };
    const view = useView<TItem, TId, TFilter, UnboxListProps<typeof props>>(
        () => createView({ value: listState, onValueChange: setListState }, viewProps),
        (current) => {
            current.update({ value: listState, onValueChange: setListState }, viewProps);
        },
        deps,
    );

    if (view.isActive()) {
        view.loadData();
    }

    const rows = view.getVisibleRows();
    const listProps = useListOptions({ view, props, listState });
    return {
        rows,
        listProps,
        getSelectedRows: view.getSelectedRows,
        selectAll: view.selectAll,
        getById: view.getById,
        reload: view.reload,
    };
}
