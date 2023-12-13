import { useCallback, useMemo } from 'react';
import { PlainTreeStrategyProps } from './types';
import { useCreateTree } from './useCreateTree';
import { useFilterTree } from './useFilterTree';
import { useSearchTree } from './useSearchTree';
import { useSortTree } from './useSortTree';
import { NOT_FOUND_RECORD } from '../../../ITree';

export function usePlainTreeStrategy<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, ...restProps }: PlainTreeStrategyProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const props = { ...restProps, sortSearchByRelevance };
    const fullTree = useCreateTree(props, deps);

    const {
        getId,
        dataSourceState,
        getFilter,
        getSearchFields,
        sortBy,
        rowOptions,
        getRowOptions,
        getChildCount,
    } = props;

    const filteredTree = useFilterTree(
        { tree: fullTree, getFilter, dataSourceState },
        deps,
    );

    const searchTree = useSearchTree(
        { tree: filteredTree, getSearchFields, sortSearchByRelevance, dataSourceState },
        deps,
    );

    const tree = useSortTree(
        { tree: searchTree, sortBy, dataSourceState },
        deps,
    );

    const getEstimatedChildrenCount = useCallback((id: TId) => {
        if (id === undefined) return undefined;

        const item = tree.getById(id);
        if (item === NOT_FOUND_RECORD) return undefined;

        const childCount = getChildCount?.(item) ?? undefined;
        if (childCount === undefined) return undefined;

        const nodeInfo = tree.getNodeInfo(id);
        if (nodeInfo?.count !== undefined) {
            // nodes are already loaded, and we know the actual count
            return nodeInfo.count;
        }

        return childCount;
    }, [getChildCount, tree]);

    const lastRowIndex = useMemo(
        () => {
            const currentLastIndex = dataSourceState.topIndex + dataSourceState.visibleCount;
            const actualCount = tree.getTotalRecursiveCount() ?? 0;

            if (actualCount < currentLastIndex) return actualCount;
            return currentLastIndex;
        },
        [tree, dataSourceState.topIndex, dataSourceState.visibleCount],
    );

    const getMissingRecordsCount = useCallback((id: TId, totalRowsCount: number, loadedChildrenCount: number) => {
        const nodeInfo = tree.getNodeInfo(id);

        const estimatedChildCount = getEstimatedChildrenCount(id);

        // Estimate how many more nodes there are at current level, to put 'loading' placeholders.
        if (nodeInfo.count !== undefined) {
            // Exact count known
            return nodeInfo.count - loadedChildrenCount;
        }

        // estimatedChildCount = undefined for top-level rows only.
        if (id === undefined && totalRowsCount < lastRowIndex) {
            return lastRowIndex - totalRowsCount; // let's put placeholders down to the bottom of visible list
        }

        if (estimatedChildCount > loadedChildrenCount) {
            // According to getChildCount (put into estimatedChildCount), there are more rows on this level
            return estimatedChildCount - loadedChildrenCount;
        }

        // We have a bad estimate - it even less that actual items we have
        // This would happen is getChildCount provides a guess count, and we scroll thru children past this count
        // let's guess we have at least 1 item more than loaded
        return 1;
    }, [lastRowIndex, tree, getEstimatedChildrenCount]);

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
            getEstimatedChildrenCount,
            getMissingRecordsCount,
            lastRowIndex,
            getId,
            dataSourceState,
            getTreeRowsStats,
        }),
        [
            tree,
            rowOptions,
            getRowOptions,
            getEstimatedChildrenCount,
            getMissingRecordsCount,
            lastRowIndex,
            dataSourceState,
            getTreeRowsStats,
        ],
    );
}
