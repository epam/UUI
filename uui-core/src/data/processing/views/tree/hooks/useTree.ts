import { useTreeStrategy } from './useTreeStrategy';
import { UseTreeResult } from './types';
import { UseTreeStrategyProps } from './strategies/types';

export type UseTreeProps<TItem, TId, TFilter = any> = UseTreeStrategyProps<TItem, TId, TFilter>;

export function useTree<TItem, TId, TFilter = any>(props: UseTreeProps<TItem, TId, TFilter>, deps: any[]): UseTreeResult<TItem, TId, TFilter> {
    return useTreeStrategy(props, deps);
}
