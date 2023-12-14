import { useMemo } from 'react';
import { Tree } from '../../../Tree';
import { LazyTreeStrategyProps } from './types';

export function useLazyTreeStrategy<TItem, TId, TFilter = any>(
    { flattenSearchResults = true, ...props }: LazyTreeStrategyProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const tree = useMemo(() => Tree.blank(props), [deps]);


}
