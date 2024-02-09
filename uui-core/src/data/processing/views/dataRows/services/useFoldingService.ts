import { useCallback, useMemo } from 'react';
import { DataRowProps, ScrollToConfig } from '../../../../../types';
import { idToKey, setObjectFlag } from '../../helpers';
import { CommonDataSourceConfig } from '../../tree/hooks/strategies/types';

export type UseFoldingServiceProps<TItem, TId, TFilter = any> = Pick<
CommonDataSourceConfig<TItem, TId, TFilter>,
'getId' | 'dataSourceState' | 'setDataSourceState' | 'isFoldedByDefault' | 'showOnlySelected'
>;

export interface FoldingService<TItem, TId> {
    handleOnFold: (rowProps: DataRowProps<TItem, TId>) => void;
    isFolded: (item: TItem) => boolean
}

export function useFoldingService<TItem, TId, TFilter = any>({
    dataSourceState,
    setDataSourceState,
    isFoldedByDefault,
    showOnlySelected,
    getId,
}: UseFoldingServiceProps<TItem, TId, TFilter>): FoldingService<TItem, TId> {
    const isFolded = useCallback((item: TItem) => {
        const searchIsApplied = !!dataSourceState?.search;
        if (searchIsApplied || showOnlySelected) {
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
    }, [isFoldedByDefault, dataSourceState?.search, dataSourceState.folded, showOnlySelected]);

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

    return useMemo(
        () => ({ handleOnFold, isFolded }),
        [handleOnFold, isFolded],
    );
}
