import { ITree } from '../../ITree';
import { STRATEGIES } from './constants';

export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];

export type TreeStrategyProps<TItem, TId> = {
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;
};

export type PlainTreeStrategyProps<TItem, TId> = TreeStrategyProps<TItem, TId> & {
    type?: typeof STRATEGIES.plain,
    items: TItem[],
    tree?: ITree<TItem, TId>
};
