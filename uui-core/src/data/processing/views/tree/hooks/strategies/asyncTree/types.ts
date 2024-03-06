import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { IMap, PatchItemsOptions, SortingOption } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';
import { RecordStatus } from '../../../types';

export interface AsyncTreeProps<TItem, TId, TFilter> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    PatchItemsOptions<TItem, TId> {

    type: typeof STRATEGIES.async;
    api(): Promise<TItem[]>;

    items?: TItem[];
    itemsMap?: ItemsMap<TId, TItem>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];
    itemsStatusMap?: IMap<TId, RecordStatus>;

    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;

    sortSearchByRelevance?: boolean;
}
