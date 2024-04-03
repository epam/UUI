import { useCallback, useMemo } from 'react';
import { DataRowProps } from '../../../../../types';
import { buildParentsLookup, idToKey } from './buildParentsLookup';
import { ITree } from '../../tree';
import { CommonTreeConfig } from '../../tree/hooks/strategies/types';

/**
 * Checking service configuration.
 */
export interface UseSelectingServiceProps<TItem, TId, TFilter = any> extends
    Pick<
    CommonTreeConfig<TItem, TId, TFilter>,
    'getParentId' | 'dataSourceState' | 'setDataSourceState'
    > {
    /**
     * Tree-like data, selection should be performed on.
     */
    tree: ITree<TItem, TId>;
}

/**
 * Service, which provides selecting functionality and seleting info.
 */
export interface SelectingService<TItem, TId> {
    /**
     * Selecting handler of a row.
     * @param row - row, which should be selected.
     */
    handleOnSelect: (row: DataRowProps<TItem, TId>) => void;

    /**
     * Provides knowledge about selection state of the row.
     * @param row - row, which selection state info should be returned.
     * @returns if row is selected.
     */
    isRowSelected: (row: DataRowProps<TItem, TId>) => boolean;

    /**
     * Provides knowledge about children selection state of the row.
     * @param row - row, which children selection state info should be returned.
     * @returns if row is selected.
     */
    isRowChildSelected: (row: DataRowProps<TItem, TId>) => boolean;
}

/**
 * Service, which provides selection functionality.
 * @returns selecting service.
 */
export function useSelectingService<TItem, TId, TFilter = any>({
    tree,
    getParentId,
    dataSourceState,
    setDataSourceState,
}: UseSelectingServiceProps<TItem, TId, TFilter>): SelectingService<TItem, TId> {
    const { selectedId } = dataSourceState;
    const selectingInfoById = useMemo(
        () => buildParentsLookup(selectedId === null ? [] : [selectedId], tree, getParentId),
        [tree, getParentId, selectedId],
    );

    const { idsByKey: selectedByKey, someChildInIdsByKey: someChildSelectedByKey } = selectingInfoById;

    const isRowSelected = useCallback((row: DataRowProps<TItem, TId>) => {
        return !!selectedByKey[idToKey(row.id)];
    }, [selectedByKey]);

    const isRowChildSelected = useCallback((row: DataRowProps<TItem, TId>) => {
        return someChildSelectedByKey[idToKey(row.id)] ?? false;
    }, [someChildSelectedByKey]);

    const handleOnSelect = useCallback((rowProps: DataRowProps<TItem, TId>) => {
        setDataSourceState((dsState) => ({
            ...dsState,
            selectedId: rowProps.id,
        }));
    }, [setDataSourceState]);

    return { handleOnSelect, isRowSelected, isRowChildSelected };
}
