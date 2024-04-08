import { useCallback } from 'react';
import { DataRowProps, DataSourceState, ScrollToConfig } from '../../../../../types';
import { idToKey, setObjectFlag } from '../../helpers';
import { CommonTreeConfig } from '../../tree/hooks/strategies/types';

/**
 * Folding service configuration.
 */
export type UseFoldingServiceProps<TItem, TId, TFilter = any> = Pick<
CommonTreeConfig<TItem, TId, TFilter>,
'getId' | 'dataSourceState' | 'setDataSourceState' | 'isFoldedByDefault'
>;

/**
 * Service, which provides folding functionality and folding info.
 */
export interface FoldingService<TItem, TId> {
    /**
     * Folding event handler.
     * @param row - row, which should be folded.
     */
    handleOnFold: (row: DataRowProps<TItem, TId>) => void;
    /**
     * Provides knowledge about folding state of the row.
     * @param row - row, which folding state info should be returned.
     * @returns if row is folded.
     */
    isFolded: (item: TItem) => boolean
}

/**
 * Service, which provides folding functionality.
 * @returns folding service.
 */
export function useFoldingService<TItem, TId, TFilter = any>({
    dataSourceState,
    setDataSourceState,
    isFoldedByDefault,
    getId,
}: UseFoldingServiceProps<TItem, TId, TFilter>): FoldingService<TItem, TId> {
    const defaultIsFolded = (state: DataSourceState<TFilter, TId>) => {
        return state.foldAll;
    };

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
            return isFoldedByDefault(item, { foldAll: dataSourceState?.foldAll });
        }

        return defaultIsFolded(dataSourceState) ?? true;
    }, [isFoldedByDefault, dataSourceState?.search, dataSourceState?.folded, dataSourceState?.foldAll]);

    const handleOnFold = useCallback((rowProps: DataRowProps<TItem, TId>) => {
        setDataSourceState((dsState) => {
            const fold = !rowProps.isFolded;
            const indexToScroll = rowProps.index - (rowProps.path?.length ?? 0);
            const scrollTo: ScrollToConfig = fold && rowProps.isPinned
                ? { index: indexToScroll, align: 'nearest' }
                : dsState.scrollTo;

            return {
                ...dsState,
                scrollTo,
                folded: setObjectFlag(dsState && dsState.folded, rowProps.rowKey, fold),
            };
        });
    }, [setDataSourceState]);

    return { handleOnFold, isFolded };
}
