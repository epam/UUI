import { useCallback, useEffect, useMemo, useState } from 'react';
import { TreeState } from '../../../newTree';
import { ClientAsyncTreeProps } from './types';
import { useLoadData } from './useLoadData';
import { useSimplePrevious } from '../../../../../../../hooks';
import { useItemsStorage } from '../../useItemsStorage';
import { useDataSourceStateWithDefaults } from '../../useDataSourceStateWithDefaults';
import { useFilterTree } from '../plainTree/useFilterTree';
import { useSortTree } from '../plainTree/useSortTree';
import { useSearchTree } from '../plainTree/useSearchTree';
import { useSelectedOnlyTree } from '../../useSelectedOnlyTree';

export function useClientAsyncTree<TItem, TId, TFilter = any>(
    { mode, ...props }: ClientAsyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const {
        getId,
        complexIds,
        getParentId,
        getFilter,
        getSearchFields,
        sortBy,
        sortSearchByRelevance,
        rowOptions,
        getRowOptions,
        setDataSourceState,
        isFoldedByDefault,
        cascadeSelection,
        showOnlySelected,
    } = props;
    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: props.itemsMap,
        items: props.items,
        setItems: props.setItems,
        params: { getId, complexIds },
    });

    const [isForceReload, setIsForceReload] = useState(false);
    const isLoaded = itemsMap.size > 0;

    const baseTree = useMemo(() => {
        if (isLoaded) {
            return TreeState.createFromItems(undefined, itemsMap, props, setItems);
        }
        return TreeState.blank(props, itemsMap, setItems);
    }, [...deps, isLoaded]);

    const prevIsForceReload = useSimplePrevious(isForceReload);
    const dataSourceState = useDataSourceStateWithDefaults({ dataSourceState: props.dataSourceState });

    const { tree: treeWithData, itemsStatusCollector, isLoading, isFetching } = useLoadData({
        getId,
        complexIds,
        api: () => props.api().then((items) => ({ items })),
        tree: baseTree,
        dataSourceState: {
            visibleCount: dataSourceState.visibleCount,
            topIndex: dataSourceState.topIndex,
            checked: dataSourceState.checked,
            selectedId: dataSourceState.selectedId,
        },
        forceReload: isForceReload,
        showOnlySelected,
        isLoaded,
    }, [...deps, baseTree]);

    const prevIsFetching = useSimplePrevious(isFetching);

    useEffect(() => {
        if (prevIsForceReload !== isForceReload && isForceReload
                && prevIsFetching !== isFetching && !isFetching) {
            setIsForceReload(false);
        }
    }, [treeWithData]);

    const reload = useCallback(() => {
        setIsForceReload(true);
    }, [setIsForceReload]);

    const filteredTree = useFilterTree(
        { tree: treeWithData, getFilter, dataSourceState, isLoading: isLoading || isFetching },
        [treeWithData],
    );

    const sortTree = useSortTree(
        { tree: filteredTree, sortBy, dataSourceState, isLoading: isLoading || isFetching },
        [filteredTree],
    );

    const searchTree = useSearchTree(
        {
            tree: sortTree,
            getSearchFields,
            sortSearchByRelevance,
            dataSourceState,
            isLoading: isLoading || isFetching,
        },
        [sortTree],
    );

    const tree = useSelectedOnlyTree({
        tree: searchTree,
        dataSourceState,
        isLoading: isLoading || isFetching,
    }, [searchTree]);

    const getChildCount = useCallback((item: TItem): number | undefined => {
        if (props.getChildCount) {
            return props.getChildCount(item) ?? tree.visible.getChildren(getId(item)).length;
        }
        return tree.visible.getChildren(getId(item)).length;
    }, [tree.visible, getId, props.getChildCount]);

    const totalCount = useMemo(() => {
        const { totalCount: rootTotalCount } = tree.visible.getItems(undefined);

        return rootTotalCount ?? tree.visible.getTotalCount?.() ?? 0;
    }, [tree.visible]);

    return {
        tree: props.showOnlySelected ? tree.selectedOnly : tree.visible,
        selectionTree: tree.full,
        reload,
        totalCount,
        isLoading,
        isFetching,
        getItemStatus: itemsStatusCollector.getItemStatus(itemsMap),
        rowOptions,
        getRowOptions,
        getChildCount,
        getParentId,
        getId,
        dataSourceState,
        setDataSourceState,
        isFoldedByDefault,
        cascadeSelection,
        showOnlySelected,
    };
}
