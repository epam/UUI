import { useCallback, useMemo } from 'react';
import { PlainTreeStrategyProps } from './types';
import { useCreateTree } from './useCreateTree';
import { useFilterTree } from './useFilterTree';
import { useSearchTree } from './useSearchTree';
import { useSortTree } from './useSortTree';
import { useCheckingService, useFocusService, useFoldingService, useSelectingService } from '../../services';

export function usePlainTreeStrategy<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, ...restProps }: PlainTreeStrategyProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const props = { ...restProps, sortSearchByRelevance };
    const fullTree = useCreateTree(props, deps);

    const {
        getId,
        getParentId,
        dataSourceState,
        setDataSourceState,
        getFilter,
        getSearchFields,
        sortBy,
        rowOptions,
        getRowOptions,
        getChildCount,
        cascadeSelection,
    } = props;

    const filteredTree = useFilterTree(
        { tree: fullTree, getFilter, dataSourceState },
        [fullTree],
    );

    const searchTree = useSearchTree(
        { tree: filteredTree, getSearchFields, sortSearchByRelevance, dataSourceState },
        [filteredTree],
    );

    const tree = useSortTree(
        { tree: searchTree, sortBy, dataSourceState },
        [searchTree],
    );

    const checkingService = useCheckingService({
        tree,
        dataSourceState,
        setDataSourceState,
        cascadeSelection,
        getParentId,
    });

    const foldingService = useFoldingService({
        dataSourceState, setDataSourceState, isFoldedByDefault: restProps.isFoldedByDefault, getId,
    });

    const focusService = useFocusService({ setDataSourceState });

    const selectingService = useSelectingService({ setDataSourceState });

    const lastRowIndex = useMemo(
        () => {
            const currentLastIndex = dataSourceState.topIndex + dataSourceState.visibleCount;
            const actualCount = tree.getTotalRecursiveCount() ?? 0;

            if (actualCount < currentLastIndex) return actualCount;
            return currentLastIndex;
        },
        [tree, dataSourceState.topIndex, dataSourceState.visibleCount],
    );

    const getTreeRowsStats = useCallback(() => {
        const rootInfo = tree.getNodeInfo(undefined);
        /* TODO: For lazy list...

        const rootCount = rootInfo.count;
        if (!getChildCount && rootCount != null) {
            completeFlatListRowsCount = rootCount;
        }

         */
        return {
            completeFlatListRowsCount: undefined,
            totalCount: rootInfo.totalCount ?? tree.getTotalRecursiveCount() ?? 0,
        };
    }, [getChildCount, tree]);

    return useMemo(
        () => ({
            tree,
            rowOptions,
            getRowOptions,
            lastRowIndex,
            getId,
            dataSourceState,
            getTreeRowsStats,
            ...checkingService,
            ...selectingService,
            ...focusService,
            ...foldingService,
        }),
        [
            tree,
            rowOptions,
            getRowOptions,
            lastRowIndex,
            dataSourceState,
            getTreeRowsStats,
            checkingService,
            selectingService,
            focusService,
            foldingService,
        ],
    );
}
