import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { PatchItemsOptions, SortingOption } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';
import { TreeState } from '../../../newTree';

export type PlainTreeProps<TItem, TId, TFilter> =
    CommonDataSourceConfig<TItem, TId, TFilter>
    & PatchItemsOptions<TItem, TId>
    & {
        type: typeof STRATEGIES.plain;
        items?: TItem[] | TreeState<TItem, TId>;
        itemsMap?: ItemsMap<TId, TItem>;
        setItems?: ItemsStorage<TItem, TId>['setItems'];

        getSearchFields?(item: TItem): string[];
        sortBy?(item: TItem, sorting: SortingOption): any;
        getFilter?(filter: TFilter): (item: TItem) => boolean;

        sortSearchByRelevance?: boolean;
    };
