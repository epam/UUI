import { useEffect, useMemo, useRef } from 'react';
import { useSimplePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';
import { NewTree } from '../../../newTree';

export type UseFilterTreeProps<TItem, TId, TFilter = any> = {
    getFilter?: (filter: TFilter) => (item: TItem) => boolean;
    tree: NewTree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useFilterTree<TItem, TId, TFilter = any>(
    { tree, dataSourceState: { filter }, getFilter }: UseFilterTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevTree = useSimplePrevious(tree);
    const prevFilter = useSimplePrevious(filter);
    const prevDeps = useSimplePrevious(deps);

    const filteredTreeRef = useRef<NewTree<TItem, TId>>(null);

    const filteredTree = useMemo(() => {
        const isDepsChanged = prevDeps?.length !== deps.length || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);
        if (filteredTreeRef.current === null || prevTree !== tree || filter !== prevFilter || isDepsChanged) {
            filteredTreeRef.current = tree.filter({ filter, getFilter });
        }
        return filteredTreeRef.current;
    }, [tree, filter, ...deps]);

    useEffect(() => {
        if (tree.itemsMap) {
            filteredTree.itemsMap = tree.itemsMap;
        }
    }, [tree?.itemsMap]);

    return filteredTree;
}
