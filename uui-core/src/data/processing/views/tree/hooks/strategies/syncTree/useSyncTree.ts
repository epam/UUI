import { useCallback, useMemo, useState } from 'react';
import { SyncTreeProps } from './types';
import { useCreateTree } from './useCreateTree';
import {
    useFilterTree, useSearchTree, useSortTree, useDataSourceStateWithDefaults,
    useItemsStorage, usePatchTree, useSelectedOnlyTree,
} from '../../common';
import { UseTreeResult } from '../../types';

export function useSyncTree<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, items, ...restProps }: SyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
    const props = { ...restProps, sortSearchByRelevance };
    const [triggerValue, trigger] = useState(false);

    const resetTree = useCallback(() => {
        trigger((currentTriggerValue) => !currentTriggerValue);
    }, [trigger]);

    const {
        getId,
        getParentId,
        complexIds,
        getFilter,
        getSearchFields,
        sortBy,
        rowOptions,
        getRowOptions,
        setDataSourceState,
        isFoldedByDefault,
        cascadeSelection,
        showSelectedOnly,
        selectAll,
        fixItemBetweenSortings,
        getNewItemPosition,
        isDeleted,
    } = props;

    const { itemsMap, setItems } = useItemsStorage({
        items,
        setItems: props.setItems,
        params: { getId, complexIds },
    });

    const fullTree = useCreateTree(
        { items, itemsMap, setItems, getId, getParentId, complexIds },
        [...deps, items, itemsMap, triggerValue],
    );

    const dataSourceState = useDataSourceStateWithDefaults({ dataSourceState: props.dataSourceState });

    const filteredTree = useFilterTree(
        { tree: fullTree, getFilter, dataSourceState },
        [fullTree],
    );

    const sortTree = useSortTree(
        { tree: filteredTree, sortBy, dataSourceState },
        [filteredTree],
    );

    const searchTree = useSearchTree(
        { tree: sortTree, getSearchFields, sortSearchByRelevance, dataSourceState },
        [sortTree],
    );

    const treeWithSelectedOnly = useSelectedOnlyTree({
        tree: searchTree,
        dataSourceState,
    }, [searchTree]);

    const { tree, applyPatch } = usePatchTree({
        tree: treeWithSelectedOnly,
        patch: showSelectedOnly ? null : restProps.patch,
        isDeleted,
        getNewItemPosition,
        fixItemBetweenSortings,
        sorting: dataSourceState.sorting,
        sortBy,
    });

    const reload = useCallback(() => {
        resetTree();
    }, [resetTree]);

    const totalCount = useMemo(() => {
        const { totalCount: rootTotalCount } = tree.visible.getItems(undefined);

        return rootTotalCount ?? tree.visible.getTotalCount?.() ?? 0;
    }, [tree.visible]);

    return {
        tree: showSelectedOnly ? tree.selectedOnly : tree.visible,
        treeWithoutPatch: treeWithSelectedOnly.visible,
        selectionTree: tree.full,
        totalCount,
        rowOptions,
        getRowOptions,
        getParentId,
        getId,
        dataSourceState,
        setDataSourceState,
        isFoldedByDefault,
        reload,
        cascadeSelection,
        showSelectedOnly,
        selectAll,
        applyPatch,
    };
}
