import { useCallback } from 'react';
import { ITree } from '../../tree';
import { CommonTreeConfig, GetItemStatus, LoadMissingRecords } from '../../tree/hooks/strategies/types';
import { FAILED_RECORD, NOT_FOUND_RECORD } from '../../tree';
import { isInProgress } from '../../helpers';
import { CheckingHelper } from '../../tree/treeStructure';

/**
 * Cascade selection service configuration.
 */
export interface UseCascadeSelectionServiceProps<TItem, TId, TFilter = any> extends
    Pick<
    CommonTreeConfig<TItem, TId, TFilter>,
    | 'rowOptions' | 'getRowOptions' | 'cascadeSelection'
    >,
    LoadMissingRecords<TItem, TId>,
    GetItemStatus<TId> {
    /**
     * Tree-like data, cascade selection should be performed on.
     */
    tree: ITree<TItem, TId>;
}

/**
 * A service which provides cascade selection functionality with loading missing records.
 */
export interface CascadeSelectionService<TId> {
    /**
     * Provides a cascade selection functionality.
     * @param isChecked - checking state of the item.
     * @param checkedId - ID of the item to be checked. If `undefined` - root is checked.
     * @param isRoot - marks if cascade selection should be performed on all the items.
     * @param checked - current state of checked items.
     * @returns new checked items.
     */
    handleCascadeSelection: (isChecked: boolean, checkedId?: TId, isRoot?: boolean, checked?: TId[]) => Promise<TId[]>;
}

/**
 * Service, which provides cascade selection functionality with support of loading missing records as needed.
 * @returns cascade selection service.
 */
export function useCascadeSelectionService<TItem, TId>({
    tree,
    cascadeSelection,
    getRowOptions,
    rowOptions,
    getItemStatus,
    loadMissingRecordsOnCheck = async () => tree,
}: UseCascadeSelectionServiceProps<TItem, TId>): CascadeSelectionService<TId> {
    const getRowProps = useCallback((item: TItem) => {
        const externalRowOptions = getRowOptions ? getRowOptions(item) : {};
        return { ...rowOptions, ...externalRowOptions };
    }, [rowOptions, getRowOptions]);

    const isItemCheckable = useCallback((id: TId, item: TItem | typeof NOT_FOUND_RECORD) => {
        if (item === NOT_FOUND_RECORD) {
            if (!getItemStatus) {
                return true;
            }

            const status = getItemStatus(id);
            if (isInProgress(status)) {
                return false;
            }

            if (status === FAILED_RECORD || status === NOT_FOUND_RECORD) {
                return true;
            }

            return false;
        }

        const rowProps = getRowProps(item);
        return rowProps?.checkbox?.isVisible && !rowProps?.checkbox?.isDisabled;
    }, [getRowProps, getItemStatus]);

    const isItemUnknown = useCallback((id: TId) => {
        const item = tree.getById(id);
        if (item !== NOT_FOUND_RECORD) {
            return false;
        }
        if (!getItemStatus) {
            return true;
        }

        const status = getItemStatus(id);
        return status === FAILED_RECORD || status === NOT_FOUND_RECORD;
    }, [tree, getItemStatus]);

    const handleCascadeSelection = useCallback(async (isChecked: boolean, checkedId?: TId, isRoot?: boolean, checked: TId[] = []) => {
        const completedTree = await loadMissingRecordsOnCheck(checkedId, isChecked, isRoot);

        return CheckingHelper.cascadeSelection<TItem, TId>({
            tree: completedTree,
            currentCheckedIds: checked,
            checkedId,
            isChecked,
            cascadeSelectionType: cascadeSelection,
            isCheckable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => isItemCheckable(id, item),
            isUnknown: isItemUnknown,
        });
    }, [tree, isItemCheckable, isItemUnknown, cascadeSelection]);

    return { handleCascadeSelection };
}
