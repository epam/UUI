import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState } from '../../../../../../types';
import { TreeState } from '../../treeState';
import { getChecked, isSelectedOrCheckedChanged } from '../strategies/checked';
import { useUpdateTreeState } from './useUpdateTreeState';

export type UseSelectedOnlyTreeProps<TItem, TId, TFilter = any> = {
    tree: TreeState<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useSelectedOnlyTree<TItem, TId, TFilter = any>(
    { tree, dataSourceState }: UseSelectedOnlyTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevDataSourceState = usePrevious(dataSourceState);

    const selectedOnlyTree = useUpdateTreeState({
        tree,
        shouldUpdate: () => isSelectedOrCheckedChanged(dataSourceState, prevDataSourceState),
        update: (currentTree) => currentTree.buildSelectedOnly(getChecked(dataSourceState)),
    }, [dataSourceState.checked, dataSourceState.selectedId, ...deps]);

    return selectedOnlyTree;
}
