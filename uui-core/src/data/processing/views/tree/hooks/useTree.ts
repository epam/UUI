import { useTreeStrategy } from './useTreeStrategy';
import { UseTreeProps, UseTreeResult } from './types';

export function useTree<TItem, TId, TFilter = any>(props: UseTreeProps<TItem, TId, TFilter>, deps: any[]): UseTreeResult<TItem, TId, TFilter> {
    const { tree, ...restProps } = useTreeStrategy(props, deps);

    return { tree, ...restProps };
}
