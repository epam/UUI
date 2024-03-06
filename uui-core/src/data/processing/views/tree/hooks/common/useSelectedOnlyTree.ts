import { useSimplePrevious } from '../../../../../../hooks';
import { DataSourceState } from '../../../../../../types';
import { TreeState } from '../../newTree';
import { getChecked, isSelectedOrCheckedChanged } from '../strategies/checked';
import { useUpdateTree } from './useUpdateTree';

export type UseSelectedOnlyTreeProps<TItem, TId, TFilter = any> = {
    tree: TreeState<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    isLoading?: boolean;
};

export function useSelectedOnlyTree<TItem, TId, TFilter = any>(
    { tree, dataSourceState, isLoading }: UseSelectedOnlyTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevDataSourceState = useSimplePrevious(dataSourceState);

    const selectedOnlyTree = useUpdateTree({
        tree,
        shouldUpdate: () => isSelectedOrCheckedChanged(dataSourceState, prevDataSourceState),
        update: (currentTree) => currentTree.buildSelectedOnly(getChecked(dataSourceState)),
    }, [dataSourceState, ...deps]);

    if (isLoading) {
        return tree;
    }

    return selectedOnlyTree;
}
