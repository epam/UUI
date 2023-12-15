import { UseTreeResult } from '../types';
import { useLazyTreeStrategy } from './lazyTree/useLazyTreeStrategy';
import { usePlainTreeStrategy } from './plainTree';
import { Strategies, TreeStrategyProps } from './types';

export type { PlainTreeStrategyProps } from './plainTree/types';

export type ExtractTreeStrategyProps<T extends Strategies, TItem, TId, TFilter = any> = Extract<TreeStrategyProps< TItem, TId, TFilter>, { type: T }>;

export type TreeStrategyHook<T extends Strategies> =
    <TItem, TId, TFilter = any>(
        props: ExtractTreeStrategyProps<T, TItem, TId, TFilter>,
        deps: any[],
    ) => UseTreeResult<TItem, TId, TFilter>;

export const strategies: { plain: TreeStrategyHook<'plain'>, lazy: TreeStrategyHook<'lazy'> } = {
    plain: usePlainTreeStrategy,
    lazy: useLazyTreeStrategy,
};
