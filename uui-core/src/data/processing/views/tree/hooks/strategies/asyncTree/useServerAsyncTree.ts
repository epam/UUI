import { useEffect, useMemo, useState } from 'react';
import { Tree } from '../../../Tree';
import { usePlainTreeStrategy } from '../plainTree';
import { ServerAsyncTreeProps } from './types';
import { useLoadData } from './useLoadData';

export function useServerAsyncTree<TItem, TId, TFilter = any>(
    props: ServerAsyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const { api, dataSourceState } = props;

    const baseTree = useMemo(() => Tree.blank(props), deps);
    const [fullTree, setFullTree] = useState(baseTree);
    const [visibleTree, setVisibleTree] = useState(fullTree);

    const { tree: treeWithData, isLoading, isFetching } = useLoadData({
        api,
        tree: fullTree,
        dataSourceState,
    }, [...deps, dataSourceState.search, dataSourceState.sorting, dataSourceState.filter]);

    useEffect(() => {
        if (treeWithData !== visibleTree) {
            setVisibleTree(treeWithData);
            const newFullTree = dataSourceState.search ? fullTree.mergeItems(treeWithData) : treeWithData;
            setFullTree(newFullTree);
        }
    }, [treeWithData]);

    const { filter, sorting, search, ...restDataSourceState } = dataSourceState;
    const { tree, ...restProps } = usePlainTreeStrategy(
        {
            ...props,
            items: visibleTree,
            dataSourceState: restDataSourceState,
            type: 'plain',
        },
        [...deps, visibleTree],
    );

    return {
        tree,
        isLoading,
        isFetching,
        ...restProps,
    };
}
