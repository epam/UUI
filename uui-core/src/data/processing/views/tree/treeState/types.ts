import { CascadeSelection, DataSourceState, IImmutableMap, IMap, SortConfig, SortedPatchByParentId, SortingOption, PatchOptions as PatchConfig } from '../../../../../types';
import { LazyListViewProps } from '../../types';
import { ItemsMap } from '../ItemsMap';
import { TreeStructure } from '../treeStructure/TreeStructure';

export interface LoadAllConfig {
    nestedChildren?: boolean;
    children?: boolean;
}

export interface LoadTreeOptions<TItem, TId, TFilter>
    extends Pick<LazyListViewProps<TItem, TId, TFilter>, 'api' | 'getChildCount' | 'filter' | 'fetchStrategy' | 'flattenSearchResults'> {
    loadAllChildren?(id: TId): LoadAllConfig;
    isLoadStrict?: boolean;
    isFolded?: (item: TItem) => boolean;
}

export type TreeStructureId = 'full' | 'visible';
export interface LoadOptions<TItem, TId, TFilter> {
    using?: TreeStructureId;
    options: LoadTreeOptions<TItem, TId, TFilter>,
    dataSourceState: Readonly<DataSourceState<TFilter, TId>>,
}

export interface LoadAllOptions<TItem, TId, TFilter> {
    using?: TreeStructureId;
    options: LoadTreeOptions<TItem, TId, TFilter>,
    dataSourceState: Readonly<DataSourceState>,
}

export interface UpdateTreeStructuresOptions<TItem, TId> {
    using?: TreeStructureId;
    treeStructure: TreeStructure<TItem, TId>;
    itemsMap: ItemsMap<TId, TItem>;
}
export interface ApplyFilterOptions<TItem, TId, TFilter> {
    filter: DataSourceState<TFilter, TId>['filter'];
    getFilter?: (filter: TFilter) => (item: TItem) => boolean;
}

export interface ApplySearchOptions<TItem, TId, TFilter> {
    search: DataSourceState<TFilter, TId>['search'];
    getSearchFields?: (item: TItem) => string[];
    sortSearchByRelevance?: boolean;
}

export interface ApplySortOptions<TItem, TId, TFilter> {
    getId: (item: TItem) => TId;
    sorting: DataSourceState<TFilter, TId>['sorting'];
    sortBy?(item: TItem, sorting: SortingOption): any;
}

export type ItemsComparator<TItem> = (newItem: TItem, existingItem: TItem) => number;

export interface FilterOptions<TItem, TId, TFilter = any> extends ApplyFilterOptions<TItem, TId, TFilter> {}
export interface SortOptions<TItem, TId, TFilter> extends Omit<ApplySortOptions<TItem, TId, TFilter>, 'getId'> {}
export interface SearchOptions<TItem, TId, TFilter> extends ApplySearchOptions<TItem, TId, TFilter> {}

export interface CascadeSelectionOptions<TItem, TId> {
    using?: TreeStructureId;
    currentCheckedIds: TId[];
    checkedId: TId;
    isChecked: boolean;
    isCheckable?: (item: TItem) => boolean;
    cascadeSelectionType?: CascadeSelection;
}

export interface PatchOptions<TItem> {
    using?: TreeStructureId;
    items: TItem[];
    isDeleted?: () => boolean;
    comparator?: ItemsComparator<TItem>;
}

/**
 * Patching tree configuration.
 */
export interface ExtendedPatchOptions<TItem, TId, TFilter = any> extends SortConfig<TItem>, Omit<PatchConfig<TItem, TId>, 'patch' | 'getNewItemPosition'> {
    /**
     * To add/move/delete some item from the existing dataset, it is required to pass that item via the `patch` map.
     */
    sortedPatch?: SortedPatchByParentId<TItem, TId>,
    patchAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    sorting: DataSourceState<TFilter, TId>['sorting'];
    filter?: DataSourceState<TFilter, TId>['filter'];
    getFilter?: (filter: TFilter) => (item: TItem) => boolean
}
