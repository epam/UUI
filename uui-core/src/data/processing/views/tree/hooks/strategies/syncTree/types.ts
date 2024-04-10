import { FilterConfig, PatchOptions, SearchConfig, SortConfig } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { ArrayDataSourceConfig, CommonTreeConfig, SharedItemsState } from '../types/common';

export type SyncTreeProps<TItem, TId, TFilter> =
    CommonTreeConfig<TItem, TId, TFilter>
    & PatchOptions<TItem, TId>
    & SearchConfig<TItem>
    & SortConfig<TItem>
    & FilterConfig<TItem, TFilter>
    & Pick<SharedItemsState<TItem, TId>, 'setItems'>
    & ArrayDataSourceConfig<TItem>
    & {
        /**
         * Type of the tree to be supported.
         */
        type: typeof STRATEGIES.sync;
    };
