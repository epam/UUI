import { useCallback, useMemo } from 'react';
import { DataRowProps, DataSourceState, ScrollToConfig } from '../../../../../../types';
import { idToKey, setObjectFlag } from '../../../helpers';

export interface UseFoldingServiceProps<TItem, TId, TFilter = any> {
    getId: (item: TItem) => TId;
    dataSourceState: DataSourceState<TFilter, TId>,
    setDataSourceState?: (dataSourceState: DataSourceState<TFilter, TId>) => void;
    isFoldedByDefault?(item: TItem): boolean;
}

export interface FoldingService<TItem, TId> {
    handleOnFold: (rowProps: DataRowProps<TItem, TId>) => void;
    isFolded: (item: TItem) => boolean
}

export function useFoldingService<TItem, TId, TFilter = any>({
    dataSourceState,
    setDataSourceState,
    isFoldedByDefault,
    getId,
}: UseFoldingServiceProps<TItem, TId, TFilter>): FoldingService<TItem, TId> {
    const isFolded = useCallback((item: TItem) => {
        const searchIsApplied = !!dataSourceState?.search;
        if (searchIsApplied) {
            return false;
        }

        const folded = dataSourceState.folded || {};
        const key = idToKey(getId(item));
        if (folded[key] != null) {
            return folded[key];
        }

        if (isFoldedByDefault) {
            return isFoldedByDefault(item);
        }

        return true;
    }, [isFoldedByDefault, dataSourceState?.search, dataSourceState.folded]);

    const handleOnFold = useCallback((rowProps: DataRowProps<TItem, TId>) => {
        if (setDataSourceState) {
            const fold = !rowProps.isFolded;
            const indexToScroll = rowProps.index - (rowProps.path?.length ?? 0);
            const scrollTo: ScrollToConfig = fold && rowProps.isPinned
                ? { index: indexToScroll, align: 'nearest' }
                : dataSourceState.scrollTo;

            setDataSourceState({
                ...dataSourceState,
                scrollTo,
                folded: setObjectFlag(dataSourceState && dataSourceState.folded, rowProps.rowKey, fold),
            });
        }
    }, [setDataSourceState, dataSourceState]);

    return useMemo(
        () => ({ handleOnFold, isFolded }),
        [handleOnFold, isFolded],
    );
}
