import { PatchOptions } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonTreeConfig, ItemsStatuses, LazyDataSourceConfig, SharedItemsState } from '../types/common';

export type LazyTreeProps<TItem, TId, TFilter> =
    CommonTreeConfig<TItem, TId, TFilter>
    & PatchOptions<TItem, TId>
    & SharedItemsState<TItem, TId>
    & ItemsStatuses<TItem, TId, TFilter>
    & LazyDataSourceConfig<TItem, TId, TFilter>
    & {

        /**
         * Type of the tree to be supported.
         */
        type: typeof STRATEGIES.lazy;
    };
