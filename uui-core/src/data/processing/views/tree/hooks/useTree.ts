import { useTreeStrategy } from './useTreeStrategy';
import { UseTreeProps } from './types';

export function useTree<TItem, TId, TFilter = any>(props: UseTreeProps<TItem, TId, TFilter>, deps: any[]) {
    const { tree, ...restProps } = useTreeStrategy(props, deps);

    return { tree, ...restProps };
}
