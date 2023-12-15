import { LazyDataSourceApi } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonTreeStrategyProps } from '../types';

export type LazyTreeStrategyProps<TItem, TId, TFilter> = CommonTreeStrategyProps<TItem, TId, TFilter> & {
    type: typeof STRATEGIES.lazy,
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    filter?: TFilter;
    fetchStrategy?: 'sequential' | 'parallel';
    flattenSearchResults?: boolean;
    legacyLoadDataBehavior?: boolean;

    backgroundReload?: boolean;
};
