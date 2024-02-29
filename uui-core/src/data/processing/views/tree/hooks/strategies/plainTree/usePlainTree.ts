import { useCallback, useMemo, useState } from 'react';
import { PlainTreeProps } from './types';
import { useCreateTree } from './useCreateTree';
import {
    useFilterTree, useSearchTree, useSortTree, useDataSourceStateWithDefaults,
    useItemsStorage, usePatchTree, useSelectedOnlyTree,
} from '../../common';
import { UseTreeResult } from '../../types';

export function usePlainTree<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, items, ...restProps }: PlainTreeProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
    const props = { ...restProps, sortSearchByRelevance };
    const [trigger, setTrigger] = useState(false);

    const resetTree = useCallback(() => {
        setTrigger((currentTrigger) => !currentTrigger);
    }, [setTrigger]);

    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: restProps.itemsMap,
        items,
        setItems: restProps.setItems,
        params: { getId: restProps.getId, complexIds: restProps.complexIds },
    });

    const fullTree = useCreateTree(
        { ...props, items, itemsMap, setItems },
        [...deps, items, itemsMap, trigger],
    );

    const {
        getId,
        getParentId,
        getFilter,
        getSearchFields,
        sortBy,
        rowOptions,
        getRowOptions,
        setDataSourceState,
        isFoldedByDefault,
        cascadeSelection,
        showOnlySelected,
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

    const searchTree = useSearchTree(
        { tree: sortTree, getSearchFields, sortSearchByRelevance, dataSourceState },
        [sortTree],
    );

    const treeWithSelectedOnly = useSelectedOnlyTree({
        tree: searchTree,
        dataSourceState,
    }, [searchTree]);

    const tree = usePatchTree({
        tree: treeWithSelectedOnly,
        patchItems: showOnlySelected ? null : restProps.patchItems,
        isDeletedProp: restProps.isDeletedProp,
        getPosition: restProps.getPosition,
    });

    const getChildCount = useCallback((item: TItem): number | undefined => {
        if (props.getChildCount) {
            return props.getChildCount(item) ?? tree.visible.getChildren(getId(item)).length;
        }
        return tree.visible.getChildren(getId(item)).length;
    }, [tree.visible, getId, props.getChildCount]);

    const reload = useCallback(() => {
        resetTree();
    }, [resetTree]);

    const totalCount = useMemo(() => {
        const { totalCount: rootTotalCount } = tree.visible.getItems(undefined);

        return rootTotalCount ?? tree.visible.getTotalCount?.() ?? 0;
    }, [tree.visible]);

    return useMemo(
        () => ({
            tree: showOnlySelected ? tree.selectedOnly : tree.visible,
            selectionTree: tree.full,
            totalCount,
            rowOptions,
            getRowOptions,
            getChildCount,
            getParentId,
            getId,
            dataSourceState,
            setDataSourceState,
            isFoldedByDefault,
            reload,
            cascadeSelection,
            showOnlySelected,
        }),
        [
            tree,
            totalCount,
            reload,
            showOnlySelected,
            dataSourceState,
            setDataSourceState,
            rowOptions,
            getRowOptions,
            dataSourceState,
            getChildCount,
            getParentId,
            getId,
            isFoldedByDefault,
            cascadeSelection,
        ],
    );
}
