import { useCallback, useMemo } from 'react';
import { DataRowProps, DataSourceState } from '../../../../../types';
import { buildParentsLookup, idToKey } from './buildParentsLookup';
import { ITree } from '../../tree';

export interface UseSelectingServiceProps<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    getParentId?: (item: TItem) => TId;
    dataSourceState: DataSourceState<TFilter, TId>;
    setDataSourceState?: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;
}

export interface SelectingService<TItem, TId> {
    handleOnSelect: (rowProps: DataRowProps<TItem, TId>) => void;
    isRowSelected: (row: DataRowProps<TItem, TId>) => boolean;
    isRowChildSelected: (row: DataRowProps<TItem, TId>) => boolean;
}

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

    return useMemo(
        () => ({
            handleOnSelect,
            isRowSelected,
            isRowChildSelected,
        }),
        [
            handleOnSelect,
            isRowSelected,
            isRowChildSelected,
        ],
    );
}
