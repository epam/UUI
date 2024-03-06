import { useCallback } from 'react';
import { ITree } from '../../tree';
import { CommonDataSourceConfig, GetItemStatus, LoadMissingRecords } from '../../tree/hooks/strategies/types';
import { CheckingHelper, FAILED_RECORD, NOT_FOUND_RECORD } from '../../tree/newTree';
import { isInProgress } from '../../helpers';

export interface UseCascadeSelectionServiceProps<TItem, TId, TFilter = any> extends
    Pick<
    CommonDataSourceConfig<TItem, TId, TFilter>,
    | 'rowOptions' | 'getRowOptions' | 'cascadeSelection'
    >,
    LoadMissingRecords<TItem, TId>,
    GetItemStatus<TId> {
    tree: ITree<TItem, TId>;
}

export interface CascadeSelectionService<TId> {
    handleCascadeSelection: (isChecked: boolean, checkedId?: TId, isRoot?: boolean, checked?: TId[]) => Promise<TId[]>;
}

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
