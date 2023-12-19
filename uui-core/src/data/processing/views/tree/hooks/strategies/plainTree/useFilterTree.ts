import { useMemo, useRef } from 'react';
import { usePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';
import { ITree } from '../../..';

export type UseFilterTreeProps<TItem, TId, TFilter = any> = {
    getFilter?: (filter: TFilter) => (item: TItem) => boolean;
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useFilterTree<TItem, TId, TFilter = any>(
    { tree, dataSourceState: { filter }, getFilter }: UseFilterTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevTree = usePrevious(tree);
    const prevFilter = usePrevious(filter);
    const prevDeps = usePrevious(deps);

    const filteredTreeRef = useRef(null);

    return useMemo(() => {
        if (filteredTreeRef.current === null || prevTree !== tree || filter !== prevFilter || prevDeps !== deps) {
            filteredTreeRef.current = tree.filter({ filter, getFilter });
        }
        return filteredTreeRef.current;
    }, [tree, filter, ...deps]);
}
