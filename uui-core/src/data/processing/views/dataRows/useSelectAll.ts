import { useMemo } from 'react';
import { NodeStats } from './stats';
import { ITree } from '../tree';

export interface UseSelectAllProps<TItem, TId> {
    tree: ITree<TItem, TId>;
    selectAll?: boolean;
    stats: NodeStats;
    checked?: TId[];
    areCheckboxesVisible: boolean;
    handleSelectAll: (isChecked: boolean) => void;
}

export function useSelectAll<TItem, TId>(props: UseSelectAllProps<TItem, TId>) {
    const isSelectAllEnabled = useMemo(() => props.selectAll === undefined ? true : props.selectAll, [props.selectAll]);

    const selectAll = useMemo(() => {
        if (props.stats.isSomeCheckable && isSelectAllEnabled) {
            return {
                value: props.stats.isSomeCheckboxEnabled ? props.stats.isAllChecked : false,
                onValueChange: props.handleSelectAll,
                indeterminate: props.checked && props.checked.length > 0 && !props.stats.isAllChecked,
            };
        } else if (props.tree.getItems().ids.length === 0 && props.areCheckboxesVisible && isSelectAllEnabled) {
            // Nothing loaded yet, but we guess that something is checkable. Add disabled checkbox for less flicker.
            return {
                value: false,
                onValueChange: () => {},
                isDisabled: true,
                indeterminate: props.checked?.length > 0,
            };
        }
        return null;
    }, [
        props.tree,
        props.areCheckboxesVisible,
        props.checked,
        props.stats,
        isSelectAllEnabled,
        props.handleSelectAll,
    ]);

    return selectAll;
}
