import { CascadeSelection, CascadeSelectionTypes, DataRowProps } from '../../../../types';

export interface NodeStats {
    isSomeCheckable: boolean;
    isSomeChecked: boolean;
    isAllChecked: boolean;
    isSomeSelected: boolean;
    hasMoreRows: boolean;
    isSomeCheckboxEnabled: boolean;
}

export const getDefaultNodeStats = () => ({
    isSomeCheckable: false,
    isSomeChecked: false,
    isAllChecked: true,
    isSomeSelected: false,
    hasMoreRows: false,
    isSomeCheckboxEnabled: false,
});

export const mergeStats = (parentStats: NodeStats, childStats: NodeStats) => ({
    ...parentStats,
    isSomeSelected: parentStats.isSomeSelected || childStats.isSomeSelected,
    isSomeCheckable: parentStats.isSomeCheckable || childStats.isSomeCheckable,
    isSomeChecked: parentStats.isSomeChecked || childStats.isSomeChecked,
    isAllChecked: parentStats.isAllChecked && childStats.isAllChecked,
    isSomeCheckboxEnabled: parentStats.isSomeCheckboxEnabled || childStats.isSomeCheckboxEnabled,
    hasMoreRows: parentStats.hasMoreRows || childStats.hasMoreRows,
});

export const getRowStats = <TItem, TId>(row: DataRowProps<TItem, TId>, actualStats: NodeStats, cascadeSelection: CascadeSelection): NodeStats => {
    let {
        isSomeCheckable, isSomeChecked, isAllChecked, isSomeSelected, isSomeCheckboxEnabled,
    } = actualStats;

    if (row.checkbox && row.checkbox.isVisible) {
        isSomeCheckable = true;
        if (row.isChecked || row.isChildrenChecked) {
            isSomeChecked = true;
        }
        if (!row.checkbox.isDisabled || isSomeCheckboxEnabled) {
            isSomeCheckboxEnabled = true;
        }

        const isImplicitCascadeSelection = cascadeSelection === CascadeSelectionTypes.IMPLICIT;
        if (
            (!row.isChecked && !row.checkbox.isDisabled && !isImplicitCascadeSelection)
            || (row.parentId === undefined && !row.isChecked && isImplicitCascadeSelection)
        ) {
            isAllChecked = false;
        }
    }

    if (row.isSelected || row.isChildrenSelected) {
        isSomeSelected = true;
    }

    return {
        ...actualStats, isSomeCheckable, isSomeChecked, isAllChecked, isSomeSelected, isSomeCheckboxEnabled,
    };
};
