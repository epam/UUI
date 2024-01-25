import { useCallback, useMemo } from 'react';
import { ITree } from '../../tree';
import { CommonDataSourceConfig, LoadMissingRecords } from '../../tree/hooks/strategies/types';
import { CheckingHelper } from '../../tree/newTree';

export interface UseCascadeSelectionServiceProps<TItem, TId, TFilter = any> extends
    Pick<
    CommonDataSourceConfig<TItem, TId, TFilter>,
    | 'rowOptions' | 'getRowOptions' | 'cascadeSelection'
    >,
    LoadMissingRecords<TItem, TId> {
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
    loadMissingRecordsOnCheck = async () => tree,
}: UseCascadeSelectionServiceProps<TItem, TId>): CascadeSelectionService<TId> {
    const getRowProps = useCallback((item: TItem) => {
        const externalRowOptions = getRowOptions ? getRowOptions(item) : {};
        return { ...rowOptions, ...externalRowOptions };
    }, [rowOptions, getRowOptions]);

    const isItemCheckable = useCallback((item: TItem) => {
        const rowProps = getRowProps(item);
        return rowProps?.checkbox?.isVisible && !rowProps?.checkbox?.isDisabled;
    }, [getRowProps]);

    const handleCascadeSelection = useCallback(async (isChecked: boolean, checkedId?: TId, isRoot?: boolean, checked: TId[] = []) => {
        const completedTree = await loadMissingRecordsOnCheck(checkedId, isChecked, isRoot);

        return CheckingHelper.cascadeSelection<TItem, TId>({
            tree: completedTree,
            currentCheckedIds: checked,
            checkedId,
            isChecked,
            cascadeSelectionType: cascadeSelection,
            isCheckable: (item: TItem) => isItemCheckable(item),
        });
    }, [tree, isItemCheckable, cascadeSelection]);

    return useMemo(() => ({ handleCascadeSelection }), [handleCascadeSelection]);
}
