import { LazyDataSourceApi } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { TreeStrategyProps } from '../types';

export type LazyTreeStrategyProps<TItem, TId, TFilter> = TreeStrategyProps<TItem, TId, TFilter> & {
    type: typeof STRATEGIES.lazy,
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    filter?: TFilter;
    fetchStrategy?: 'sequential' | 'parallel';
    flattenSearchResults?: boolean;
    legacyLoadDataBehavior?: boolean;

    backgroundReload?: boolean;
};
