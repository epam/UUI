import { useCallback } from 'react';
import { ITree } from '../../tree';
import { LoadMissingRecords } from '../../tree/hooks/strategies/types';

/**
 * Cascade selection service configuration.
 */
export interface UseCascadeSelectionServiceProps<TItem, TId> extends
    LoadMissingRecords<TItem, TId> {
    /**
     * Tree-like data, cascade selection should be performed on.
     */
    tree: ITree<TItem, TId>;
}

/**
 * A service which provides cascade selection functionality with loading missing records.
 */
export interface CascadeSelectionService<TItem, TId> {
    /**
     * Provides a cascade selection functionality.
     * @param isChecked - checking state of the item.
     * @param checkedId - ID of the item to be checked. If `undefined` - root is checked.
     * @param isRoot - marks if cascade selection should be performed on all the items.
     * @param checked - current state of checked items.
     * @returns new checked items.
     */
    getCompleteTreeForCascadeSelection: (id: TId, isChecked: boolean, isRoot: boolean) => Promise<ITree<TItem, TId>>;
}

/**
 * Service, which provides cascade selection functionality with support of loading missing records as needed.
 * @returns cascade selection service.
 */
export function useCascadeSelectionService<TItem, TId>({
    tree,
    loadMissingRecordsOnCheck = async () => tree,
}: UseCascadeSelectionServiceProps<TItem, TId>): CascadeSelectionService<TItem, TId> {
    const getCompleteTreeForCascadeSelection = useCallback(async (checkedId: TId, isChecked: boolean, isRoot?: boolean) => {
        return await loadMissingRecordsOnCheck(checkedId, isChecked, isRoot);
    }, [tree, loadMissingRecordsOnCheck]);

    return { getCompleteTreeForCascadeSelection };
}
