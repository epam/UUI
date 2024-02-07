import { IMap, LazyDataSourceApi } from '../../../../../../../types';
import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { RecordStatus } from '../../../newTree';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';

export type LazyTreeProps<TItem, TId, TFilter> = CommonDataSourceConfig<TItem, TId, TFilter> & {
    type: typeof STRATEGIES.lazy,
    itemsMap?: ItemsMap<TId, TItem>;
    itemsStatusMap?: IMap<TId, RecordStatus>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];
    setLoadingStatus?: ItemsStorage<TItem, TId>['setLoadingStatus'];

    patchItems?: ItemsMap<TId, TItem>;

    api: LazyDataSourceApi<TItem, TId, TFilter>;
    filter?: TFilter;
    fetchStrategy?: 'sequential' | 'parallel';
    backgroundReload?: boolean;
};
