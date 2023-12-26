import { UseTreeResult } from '../../types';
import { STRATEGIES } from '../constants';
import { LazyTreeStrategyProps } from '../lazyTree/types';
import { PlainTreeStrategyProps } from '../../strategies/plainTree/types';
import { ITree } from '../../..';
import { AsyncTreeStrategyProps } from '../asyncTree/types';

type PlainTreeStrategyPropsWithOptionalType<TItem, TId, TFilter = any> = Omit<PlainTreeStrategyProps<TItem, TId, TFilter>, 'type'> & { type?: 'plain' };

export type UseTreeStrategyProps<TItem, TId, TFilter = any> = Exclude<TreeStrategyProps<TItem, TId, TFilter>, { type: 'plain' }>
| PlainTreeStrategyPropsWithOptionalType<TItem, TId, TFilter>;

export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];

export type ExtractTreeStrategyProps<T extends Strategies, TItem, TId, TFilter = any> = Extract<TreeStrategyProps< TItem, TId, TFilter>, { type: T }>;

export type TreeStrategyHook<T extends Strategies> =
    <TItem, TId, TFilter = any>(
        props: ExtractTreeStrategyProps<T, TItem, TId, TFilter>,
        deps: any[],
    ) => UseTreeResult<TItem, TId, TFilter>;

export type TreeStrategyProps<TItem, TId, TFilter = any> = (
    PlainTreeStrategyProps<TItem, TId, TFilter>
    | AsyncTreeStrategyProps<TItem, TId, TFilter>
    | LazyTreeStrategyProps<TItem, TId, TFilter>
);

export interface LoadMissingRecords<TItem, TId> {
    loadMissingRecords?: (currentTree: ITree<TItem, TId>, id: TId, isChecked: boolean, isRoot: boolean) => Promise<ITree<TItem, TId>>;
}
