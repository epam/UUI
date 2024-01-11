import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { SortingOption } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';

export type PlainTreeStrategyProps<TItem, TId, TFilter> = CommonDataSourceConfig<TItem, TId, TFilter> & {
    type: typeof STRATEGIES.plain;
    items?: TItem[];
    itemsMap?: ItemsMap<TId, TItem>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];

    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;

    sortSearchByRelevance?: boolean;
};
