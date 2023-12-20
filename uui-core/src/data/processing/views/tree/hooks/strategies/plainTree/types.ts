import { SortingOption } from '../../../../../../../types';
import { ITree } from '../../../ITree';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';

export type PlainTreeStrategyProps<TItem, TId, TFilter> = CommonDataSourceConfig<TItem, TId, TFilter> & {
    type: typeof STRATEGIES.plain,
    items: TItem[] | Record<string | number | symbol, TItem>,
    tree?: ITree<TItem, TId>,

    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;

    sortSearchByRelevance?: boolean;
};
