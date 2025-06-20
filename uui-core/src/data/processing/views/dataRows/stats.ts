import { CascadeSelection, CascadeSelectionTypes, DataRowProps } from '../../../../types';

export interface NodeStats {
    isSomeCheckable: boolean;
    isSomeChecked: boolean;
    isAllChecked: boolean;
    isSomeSelected: boolean;
    hasMoreRows: boolean;
    isSomeCheckboxEnabled: boolean;
    isPartiallyLoaded?: boolean;
}

export const getDefaultNodeStats = (): NodeStats => ({
    isSomeCheckable: false,
    isSomeChecked: false,
    isAllChecked: true,
    isSomeSelected: false,
    hasMoreRows: false,
    isSomeCheckboxEnabled: false,
    isPartiallyLoaded: false,
});

export const mergeStats = (parentStats: NodeStats, childStats: NodeStats) => ({
    ...parentStats,
    isSomeSelected: parentStats.isSomeSelected || childStats.isSomeSelected,
    isSomeCheckable: parentStats.isSomeCheckable || childStats.isSomeCheckable,
    isSomeChecked: parentStats.isSomeChecked || childStats.isSomeChecked,
    isAllChecked: parentStats.isAllChecked && childStats.isAllChecked,
    isSomeCheckboxEnabled: parentStats.isSomeCheckboxEnabled || childStats.isSomeCheckboxEnabled,
    hasMoreRows: parentStats.hasMoreRows || childStats.hasMoreRows,
    isPartiallyLoaded: parentStats.isPartiallyLoaded || childStats.isPartiallyLoaded,
});

export const getRowStats = <TItem, TId>(row: DataRowProps<TItem, TId>, actualStats: NodeStats, cascadeSelection: CascadeSelection): NodeStats => {
    let {
        isSomeCheckable, isSomeChecked, isAllChecked, isSomeSelected, isSomeCheckboxEnabled,
    } = actualStats;
    const isImplicitCascadeSelection = cascadeSelection === CascadeSelectionTypes.IMPLICIT;

    if (row.checkbox && row.checkbox.isVisible) {
        isSomeCheckable = true;
        if (row.isChecked || row.isChildrenChecked) {
            isSomeChecked = true;
        }
        if (!row.checkbox.isDisabled || isSomeCheckboxEnabled) {
            isSomeCheckboxEnabled = true;
        }

        if (!row.isChecked && !isImplicitCascadeSelection) {
            // if checkbox is not checked and disabled, should pass the previous state of all checked further.
            isAllChecked = row.checkbox.isDisabled ? isAllChecked : false;
        } else if (row.parentId === undefined && !row.isChecked && isImplicitCascadeSelection) {
            isAllChecked = false;
        }
    }

    if (row.isSelected || row.isChildrenSelected) {
        isSomeSelected = true;
    }

    return {
        ...actualStats,
        isSomeCheckable,
        isSomeChecked,
        isAllChecked,
        isSomeSelected,
        isSomeCheckboxEnabled,
    };
};
