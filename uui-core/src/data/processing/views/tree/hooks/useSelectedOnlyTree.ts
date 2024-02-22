import { useMemo, useRef } from 'react';
import { useSimplePrevious } from '../../../../../hooks';
import { DataSourceState } from '../../../../../types';
import { TreeState } from '../newTree';
import { getChecked, isSelectedOrCheckedChanged } from './strategies/checked';

export type UseFilterTreeProps<TItem, TId, TFilter = any> = {
    tree: TreeState<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    isLoading?: boolean;
};

export function useSelectedOnlyTree<TItem, TId, TFilter = any>(
    { tree, dataSourceState, isLoading }: UseFilterTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevTree = useSimplePrevious(tree);
    const prevDataSourceState = useSimplePrevious(dataSourceState);
    const prevDeps = useSimplePrevious(deps);

    const selectedOnlyTreeRef = useRef<TreeState<TItem, TId>>(null);

    const selectedOnlyTree = useMemo(() => {
        const isDepsChanged = prevDeps?.length !== deps.length || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);
        if (selectedOnlyTreeRef.current === null
            || prevTree !== tree
            || isSelectedOrCheckedChanged(dataSourceState, prevDataSourceState)
            || isDepsChanged
        ) {
            selectedOnlyTreeRef.current = tree.buildSelectedOnly(getChecked(dataSourceState));
        }
        return selectedOnlyTreeRef.current;
    }, [tree, dataSourceState, prevDataSourceState, ...deps]);

    if (isLoading) {
        return tree;
    }

    return selectedOnlyTree;
}
