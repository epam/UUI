import { useMemo, useRef } from 'react';
import { useSimplePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';
import { ITree } from '../../../../tree';

export type UseFilterTreeProps<TItem, TId, TFilter = any> = {
    getFilter?: (filter: TFilter) => (item: TItem) => boolean;
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useFilterTree<TItem, TId, TFilter = any>(
    { tree, dataSourceState: { filter }, getFilter }: UseFilterTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevTree = useSimplePrevious(tree);
    const prevFilter = useSimplePrevious(filter);
    const prevDeps = useSimplePrevious(deps);

    const filteredTreeRef = useRef(null);

    return useMemo(() => {
        const isDepsChanged = prevDeps?.length !== deps.length || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);
        if (filteredTreeRef.current === null || prevTree !== tree || filter !== prevFilter || isDepsChanged) {
            filteredTreeRef.current = tree.filter({ filter, getFilter });
        }
        return filteredTreeRef.current;
    }, [tree, filter, ...deps]);
}
