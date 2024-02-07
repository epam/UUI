import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { IMap, SortingOption } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';
import { RecordStatus, TreeState } from '../../../newTree';

export type PlainTreeProps<TItem, TId, TFilter> = CommonDataSourceConfig<TItem, TId, TFilter> & {
    type: typeof STRATEGIES.plain;
    items?: TItem[] | TreeState<TItem, TId>;
    itemsMap?: ItemsMap<TId, TItem>;
    itemsStatusMap?: IMap<TId, RecordStatus>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];

    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;

    sortSearchByRelevance?: boolean;
};
