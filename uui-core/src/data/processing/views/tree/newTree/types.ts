import { CascadeSelection, DataSourceState } from '../../../../../types';
import { ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ItemsComparator, LoadAllTreeOptions, LoadTreeOptions } from '../ITree';
import { CompositeKeysMap } from '../CompositeKeysMap';
import type { TreeSnapshot } from '../newTree';
import { ItemsMap } from '../../../ItemsMap';

export interface LoadOptions<TItem, TId, TFilter = any> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>;
    dataSourceState: Readonly<DataSourceState>;
    withNestedChildren: boolean;
}

export interface LoadItemsOptions<TItem, TId, TFilter = any> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>,
    parentId: TId,
    parent: TItem,
    dataSourceState: Readonly<DataSourceState>,
    remainingRowsCount: number,
    loadAll: boolean,
}

export interface LoadMissingItemsAndParentsOptions<TItem, TId, TFilter = any> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>;
    itemsToLoad: TId[];
}

export interface LoadAllOptions<TItem, TId, TFilter = any> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: LoadAllTreeOptions<TItem, TId, TFilter>;
    dataSourceState: DataSourceState;
}

export interface FilterOptions<TItem, TId, TFilter = any> extends ApplyFilterOptions<TItem, TId, TFilter> {
    snapshot: TreeSnapshot<TItem, TId>;
}

export interface ApplyFilterToTreeSnapshotOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    filter: undefined | ((item: TItem) => number | boolean);
}

export interface SearchOptions<TItem, TId, TFilter> extends ApplySearchOptions<TItem, TId, TFilter> {
    snapshot: TreeSnapshot<TItem, TId>;
}

export interface ApplySearchToTreeSnapshotOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    search: undefined | ((item: TItem) => number | boolean);
    sortSearchByRelevance?: boolean;
}

export interface SortOptions<TItem, TId, TFilter> extends ApplySortOptions<TItem, TId, TFilter> {
    snapshot: TreeSnapshot<TItem, TId>;
}

export interface PatchOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    items: TItem[];
    isDeletedProp?: keyof TItem;
    comparator?: ItemsComparator<TItem>;
}

export interface PatchChildrenOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    itemsMap: ItemsMap<TId, TItem>;
    children: TId[] | undefined;
    existingItem: TItem | undefined;
    newItem: TItem;
    comparator: ItemsComparator<TItem>;
}

export interface PasteItemIntoChildrenListOptions<TItem, TId> {
    id: TId;
    item: TItem;
    children: TId[];
    comparator: ItemsComparator<TItem>;
    itemsMap: ItemsMap<TId, TItem>;
}

export interface CascadeSelectionOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    currentCheckedIds: TId[];
    checkedId: TId;
    isChecked: boolean;
    isCheckable?: (item: TItem) => boolean;
    cascadeSelectionType?: CascadeSelection;
}

export interface SelectionOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>,
    checkedId: TId,
    isChecked: boolean,
    isCheckable: (item: TItem) => boolean,
}

export interface ActForCheckableOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    action: (id: TId) => void;
    isCheckable: (item: TItem) => boolean;
    id: TId;
}

export interface CheckParentsWithFullCheckOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>,
    checkedId: TId,
    isCheckable: (item: TItem) => boolean,
    removeExplicitChildrenSelection?: boolean,
}
