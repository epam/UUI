import { PlainTreeStrategyProps } from './types';
import { useCreateTree } from './useCreateTree';
import { useFilterTree } from './useFilterTree';
import { useSearchTree } from './useSearchTree';
import { useSortTree } from './useSortTree';

export function usePlainTreeStrategy<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, ...restProps }: PlainTreeStrategyProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const props = { ...restProps, sortSearchByRelevance };
    const tree = useCreateTree(props, deps);

    const { dataSourceState, getFilter, getSearchFields, sortBy } = props;

    const filteredTree = useFilterTree(
        { tree, getFilter, dataSourceState },
        deps,
    );

    const searchTree = useSearchTree(
        { tree: filteredTree, getSearchFields, sortSearchByRelevance, dataSourceState },
        deps,
    );

    const sortedTree = useSortTree(
        { tree: searchTree, sortBy, dataSourceState },
        deps,
    );

    return sortedTree;
}
