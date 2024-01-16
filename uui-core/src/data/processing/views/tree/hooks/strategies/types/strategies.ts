import { UseTreeResult } from '../../types';
import { STRATEGIES } from '../constants';
import { LazyTreeProps } from '../lazyTree/types';
import { PlainTreeProps } from '../../strategies/plainTree/types';
import { AsyncTreeProps } from '../asyncTree/types';
import { NewTree } from '../../../newTree';

type PlainTreePropsWithOptionalType<TItem, TId, TFilter = any> = Omit<PlainTreeProps<TItem, TId, TFilter>, 'type'> & { type?: 'plain' };

export type UseTreeProps<TItem, TId, TFilter = any> = Exclude<TreeProps<TItem, TId, TFilter>, { type: 'plain' }>
| PlainTreePropsWithOptionalType<TItem, TId, TFilter>;

export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];

export type ExtractTreeProps<T extends Strategies, TItem, TId, TFilter = any> = Extract<TreeProps< TItem, TId, TFilter>, { type: T }>;

export type TreeHook<T extends Strategies> =
    <TItem, TId, TFilter = any>(
        props: ExtractTreeProps<T, TItem, TId, TFilter>,
        deps: any[],
    ) => UseTreeResult<TItem, TId, TFilter>;

export type TreeProps<TItem, TId, TFilter = any> = (
    PlainTreeProps<TItem, TId, TFilter>
    | AsyncTreeProps<TItem, TId, TFilter>
    | LazyTreeProps<TItem, TId, TFilter>
);

export interface LoadMissingRecords<TItem, TId> {
    loadMissingRecords?: (currentTree: NewTree<TItem, TId>, id: TId, isChecked: boolean, isRoot: boolean) => Promise<NewTree<TItem, TId>>;
}
