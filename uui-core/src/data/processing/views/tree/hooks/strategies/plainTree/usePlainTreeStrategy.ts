import { useCallback, useMemo, useState } from 'react';
import { PlainTreeStrategyProps } from './types';
import { useCreateTree } from './useCreateTree';
import { useFilterTree } from './useFilterTree';
import { useSearchTree } from './useSearchTree';
import { useSortTree } from './useSortTree';
import { UseTreeResult } from '../../types';
import { useDataSourceStateWithDefaults } from '../useDataSourceStateWithDefaults';

export function usePlainTreeStrategy<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, ...restProps }: PlainTreeStrategyProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
    const props = { ...restProps, sortSearchByRelevance };
    const [trigger, setTrigger] = useState(false);

    const resetTree = useCallback(() => {
        setTrigger((currentTrigger) => !currentTrigger);
    }, [setTrigger]);

    const fullTree = useCreateTree(props, [...deps, trigger]);

    const {
        getId,
        getParentId,
        getFilter,
        getSearchFields,
        sortBy,
        rowOptions,
        getRowOptions,
        setDataSourceState,
    } = props;

    const dataSourceState = useDataSourceStateWithDefaults({ dataSourceState: props.dataSourceState });

    const filteredTree = useFilterTree(
        { tree: fullTree, getFilter, dataSourceState },
        [fullTree],
    );

    const sortTree = useSortTree(
        { tree: filteredTree, sortBy, dataSourceState },
        [filteredTree],
    );

    const tree = useSearchTree(
        { tree: sortTree, getSearchFields, sortSearchByRelevance, dataSourceState },
        [sortTree],
    );

    const treeRowsStats = useMemo(() => {
        const rootInfo = tree.getNodeInfo(undefined);

        return {
            completeFlatListRowsCount: undefined,
            totalCount: rootInfo.totalCount ?? tree.getTotalRecursiveCount() ?? 0,
        };
    }, [tree]);

    const getChildCount = useCallback((item: TItem): number | undefined => {
        if (props.getChildCount) {
            return props.getChildCount(item) ?? tree.getChildrenByParentId(getId(item)).length;
        }
        return tree.getChildrenByParentId(getId(item)).length;
    }, [tree, getId, props.getChildCount]);

    const reload = useCallback(() => {
        resetTree();
    }, [resetTree]);

    return useMemo(
        () => ({
            tree,
            fullTree: sortTree,
            rowOptions,
            getRowOptions,
            getChildCount,
            getParentId,
            getId,
            dataSourceState,
            setDataSourceState,
            reload,
            ...treeRowsStats,
        }),
        [
            tree,
            sortTree,
            dataSourceState,
            setDataSourceState,
            rowOptions,
            getRowOptions,
            dataSourceState,
            treeRowsStats,
            getChildCount,
            getParentId,
            getId,
        ],
    );
}
