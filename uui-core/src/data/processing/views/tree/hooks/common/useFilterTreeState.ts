import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState } from '../../../../../../types';
import { TreeState } from '../../treeState';
import { useUpdateTreeState } from './useUpdateTreeState';

export type UseFilterTreeStateProps<TItem, TId, TFilter = any> = {
    getFilter?: (filter: TFilter) => (item: TItem) => boolean;
    tree: TreeState<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    isLoading?: boolean;
};

export function useFilterTreeState<TItem, TId, TFilter = any>(
    { tree, dataSourceState: { filter }, getFilter, isLoading }: UseFilterTreeStateProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevFilter = usePrevious(filter);
    const filteredTree = useUpdateTreeState({
        tree,
        shouldUpdate: () => filter !== prevFilter,
        update: (currentTree) => currentTree.filter({ filter, getFilter }),
    }, [filter, ...deps]);

    if (isLoading || filteredTree === null) {
        return tree;
    }

    return filteredTree;
}
