import { SortingOption } from '../../../../../../../types';
import { NewTree } from '../../../newTree';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';

export type PlainTreeStrategyProps<TItem, TId, TFilter> = CommonDataSourceConfig<TItem, TId, TFilter> & {
    type: typeof STRATEGIES.plain,
    items: TItem[] | Record<string | number | symbol, TItem> | NewTree<TItem, TId>,
    tree?: NewTree<TItem, TId>,

    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;

    sortSearchByRelevance?: boolean;
};
