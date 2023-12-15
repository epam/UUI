import { useCallback, useEffect, useMemo } from 'react';
import { PlainTreeStrategyProps } from './types';
import { useCreateTree } from './useCreateTree';
import { useFilterTree } from './useFilterTree';
import { useSearchTree } from './useSearchTree';
import { useSortTree } from './useSortTree';
import { useCheckingService, useFocusService, useFoldingService, useSelectingService } from '../../services';
import { UseTreeResult } from '../../types';

export function usePlainTreeStrategy<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, ...restProps }: PlainTreeStrategyProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
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

    useEffect(() => {
        if (dataSourceState.topIndex === undefined || dataSourceState.visibleCount === undefined) {
            setDataSourceState({ topIndex: dataSourceState.topIndex ?? 0, visibleCount: dataSourceState?.visibleCount ?? 20 });
        }
    }, [dataSourceState]);

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

    const getTreeRowsStats = useCallback(() => {
        const rootInfo = tree.getNodeInfo(undefined);

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
            dataSourceState,
            getTreeRowsStats,
            checkingService,
            selectingService,
            focusService,
            foldingService,
        ],
    );
}
