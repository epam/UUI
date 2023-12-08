import { useMemo } from 'react';
import { PlainTreeStrategyProps } from './types';
import { useCheckingService } from './useCheckingService';
import { useCreateTree } from './useCreateTree';
import { useFilterTree } from './useFilterTree';
import { useSearchTree } from './useSearchTree';
import { useSortTree } from './useSortTree';

export function usePlainTreeStrategy<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, ...restProps }: PlainTreeStrategyProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const props = { ...restProps, sortSearchByRelevance };
    const fullTree = useCreateTree(props, deps);

    const { dataSourceState, getFilter, getSearchFields, sortBy, cascadeSelection, getParentId } = props;

    const filteredTree = useFilterTree(
        { tree: fullTree, getFilter, dataSourceState },
        deps,
    );

    const searchTree = useSearchTree(
        { tree: filteredTree, getSearchFields, sortSearchByRelevance, dataSourceState },
        deps,
    );

    const tree = useSortTree(
        { tree: searchTree, sortBy, dataSourceState },
        deps,
    );

    const checkingService = useCheckingService({
        tree, checked: dataSourceState.checked, cascadeSelection, getParentId,
    });

    return useMemo(
        () => ({ tree, ...checkingService }),
        [tree, checkingService],
    );
}
