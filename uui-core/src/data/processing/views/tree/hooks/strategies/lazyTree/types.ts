import { GetChildCount, IMap, LazyDataSourceApi, PatchItemsOptions } from '../../../../../../../types';
import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { RecordStatus } from '../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';

export type LazyTreeProps<TItem, TId, TFilter> =
    CommonDataSourceConfig<TItem, TId, TFilter>
    & PatchItemsOptions<TItem, TId>
    & GetChildCount<TItem>
    & {
        type: typeof STRATEGIES.lazy,
        itemsMap?: ItemsMap<TId, TItem>;
        setItems?: ItemsStorage<TItem, TId>['setItems'];
        itemsStatusMap?: IMap<TId, RecordStatus>;

        api: LazyDataSourceApi<TItem, TId, TFilter>;
        filter?: TFilter;
        fetchStrategy?: 'sequential' | 'parallel';
        backgroundReload?: boolean;
        flattenSearchResults?: boolean;
    };
