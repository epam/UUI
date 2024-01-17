import { useCallback, useMemo, useState } from 'react';
import { PlainTreeProps } from './types';
import { useCreateTree } from './useCreateTree';
import { useFilterTree } from './useFilterTree';
import { useSearchTree } from './useSearchTree';
import { useSortTree } from './useSortTree';
import { UseTreeResult } from '../../types';
import { useDataSourceStateWithDefaults } from '../useDataSourceStateWithDefaults';
import { useItemsStorage } from '../useItemsStorage';

export function usePlainTree<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, ...restProps }: PlainTreeProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
    const props = { ...restProps, sortSearchByRelevance };
    const [trigger, setTrigger] = useState(false);

    const resetTree = useCallback(() => {
        setTrigger((currentTrigger) => !currentTrigger);
    }, [setTrigger]);

    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: restProps.itemsMap,
        items: restProps.items,
        setItems: restProps.setItems,
        getId: restProps.getId,
    });

    const fullTree = useCreateTree({ ...props, itemsMap, setItems }, [...deps, trigger]);
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

    const treeSnapshot = useMemo(() => tree.snapshot(), [tree]);

    const getChildCount = useCallback((item: TItem): number | undefined => {
        if (props.getChildCount) {
            return props.getChildCount(item) ?? treeSnapshot.getChildrenByParentId(getId(item)).length;
        }
        return treeSnapshot.getChildrenByParentId(getId(item)).length;
    }, [treeSnapshot, getId, props.getChildCount]);

    const reload = useCallback(() => {
        resetTree();
    }, [resetTree]);

    return useMemo(
        () => ({
            tree,
            rowOptions,
            getRowOptions,
            getChildCount,
            getParentId,
            getId,
            dataSourceState,
            setDataSourceState,
            reload,
        }),
        [
            tree,
            dataSourceState,
            setDataSourceState,
            rowOptions,
            getRowOptions,
            dataSourceState,
            getChildCount,
            getParentId,
            getId,
        ],
    );
}
