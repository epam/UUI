import { LazyDataSourceApi } from '../../../../../../../types';
import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';

export type LazyTreeProps<TItem, TId, TFilter> = CommonDataSourceConfig<TItem, TId, TFilter> & {
    type: typeof STRATEGIES.lazy,
    itemsMap?: ItemsMap<TId, TItem>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];

    api: LazyDataSourceApi<TItem, TId, TFilter>;
    filter?: TFilter;
    fetchStrategy?: 'sequential' | 'parallel';
    backgroundReload?: boolean;
};
