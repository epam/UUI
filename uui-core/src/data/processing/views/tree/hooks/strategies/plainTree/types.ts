import { SortingOption } from '../../../../../../../types';
import { ITree } from '../../../ITree';
import { STRATEGIES } from '../constants';
import { TreeStrategyProps } from '../types';

export type PlainTreeStrategyProps<TItem, TId, TFilter> = TreeStrategyProps<TItem, TId, TFilter> & {
    type?: typeof STRATEGIES.plain,
    items: TItem[],
    tree?: ITree<TItem, TId>,

    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;

    sortSearchByRelevance?: boolean;
};
