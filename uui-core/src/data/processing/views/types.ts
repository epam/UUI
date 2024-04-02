import { BaseListViewProps, FilterConfig, SearchConfig, SortConfig } from '../../../types';
import { ArrayDataSourceConfig, AsyncDataSourceConfig, LazyDataSourceConfig } from './tree/hooks/strategies/types';

export interface BaseArrayListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter>,
    SortConfig<TItem>,
    SearchConfig<TItem>,
    FilterConfig<TItem, TFilter> {}

export interface ArrayListViewProps<TItem, TId, TFilter> extends BaseArrayListViewProps<TItem, TId, TFilter>,
    ArrayDataSourceConfig<TItem> {}

export interface AsyncListViewProps<TItem, TId, TFilter> extends BaseArrayListViewProps<TItem, TId, TFilter>,
    AsyncDataSourceConfig<TItem> {}

export interface LazyListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter>,
    LazyDataSourceConfig<TItem, TId, TFilter> {}
