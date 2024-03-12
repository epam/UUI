import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { PatchItemsOptions, SortingOption } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';
import { TreeState } from '../../../newTree';

export type PlainTreeProps<TItem, TId, TFilter> =
    CommonDataSourceConfig<TItem, TId, TFilter>
    & PatchItemsOptions<TItem, TId>
    & {
        /**
         * Type of the tree to be supported.
         */
        type: typeof STRATEGIES.plain;

        /**
         * Data, which should be represented by a DataSource.
         */
        items?: TItem[] | TreeState<TItem, TId>;

        /**
         * Map of shared items.
         */
        itemsMap?: ItemsMap<TId, TItem>;

        /**
         * Items updating listener, which fires on items loading/reloading/reset.
         */
        setItems?: ItemsStorage<TItem, TId>['setItems'];

        /**
         * A pure function that gets search value for each item.
         * @default (item) => item.name.
         */
        getSearchFields?(item: TItem): string[];

        /**
         * A pure function that gets sorting value for current sorting value
         */
        sortBy?(item: TItem, sorting: SortingOption): any;

        /**
         * A pure function that returns filter callback to be applied for each item.
         * The callback should return true, if item passed the filter.
         */
        getFilter?(filter: TFilter): (item: TItem) => boolean;

        /**
         * Enables sorting of search results by relevance.
         * - The highest priority has records, which have a full match with a search keyword.
         * - The lower one has records, which have a search keyword at the 0 position, but not the full match.
         * - Then, records, which contain a search keyword as a separate word, but not at the beginning.
         * - And the lowest one - any other match of the search keyword.
         *
         * Example:
         * - `search`: 'some'
         * - `record string`: 'some word', `rank` = 4
         * - `record string`: 'someone', `rank` = 3
         * - `record string`: 'I know some guy', `rank` = 2
         * - `record string`: 'awesome', `rank` = 1
         *
         * @default true
         */
        sortSearchByRelevance?: boolean;
    };
