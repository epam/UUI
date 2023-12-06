import { useTreeStrategy } from './useTreeStrategy';
import { UseTreeProps } from './types';

export function useTree<TItem, TId, TFilter = any>(params: UseTreeProps<TItem, TId, TFilter>, deps: any[]) {
    const tree = useTreeStrategy(params, deps);

    return tree;
}
