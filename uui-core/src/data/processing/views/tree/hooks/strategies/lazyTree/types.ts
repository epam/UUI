import { LazyDataSourceApi } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';

export type LazyTreeStrategyProps<TItem, TId, TFilter> = CommonDataSourceConfig<TItem, TId, TFilter> & {
    type: typeof STRATEGIES.lazy,
    // itemsMap?: ItemsMap<TId, TItem>;
    // setItems?: ItemsStorage<TItem, TId>['setItems'];

    api: LazyDataSourceApi<TItem, TId, TFilter>;
    filter?: TFilter;
    fetchStrategy?: 'sequential' | 'parallel';
    backgroundReload?: boolean;
};
