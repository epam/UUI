import { CascadeSelection, DataSourceState } from '../../../../../types';
import { ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ItemsComparator, LoadAllTreeOptions, LoadTreeOptions } from '../ITree';
import { CompositeKeysMap } from '../CompositeKeysMap';
import { ItemsMap } from '../../../ItemsMap';

export interface LoadOptions<TItem, TId, TFilter = any> {
    options: LoadTreeOptions<TItem, TId, TFilter>;
    dataSourceState: Readonly<DataSourceState>;
    withNestedChildren: boolean;
}

export interface LoadItemsOptions<TItem, TId, TFilter = any> {
    options: LoadTreeOptions<TItem, TId, TFilter>,
    parentId: TId,
    parent: TItem,
    dataSourceState: Readonly<DataSourceState>,
    remainingRowsCount: number,
    loadAll: boolean,
}

export interface LoadMissingItemsAndParentsOptions<TItem, TId, TFilter = any> {
    options: LoadTreeOptions<TItem, TId, TFilter>;
    itemsToLoad: TId[];
}

export interface LoadAllOptions<TItem, TId, TFilter = any> {
    options: LoadAllTreeOptions<TItem, TId, TFilter>;
    dataSourceState: DataSourceState;
}

export interface FilterOptions<TItem, TId, TFilter = any> extends ApplyFilterOptions<TItem, TId, TFilter> {}

export interface ApplyFilterToTreeSnapshotOptions<TItem> {
    filter: undefined | ((item: TItem) => number | boolean);
}

export interface SearchOptions<TItem, TId, TFilter> extends ApplySearchOptions<TItem, TId, TFilter> {}

export interface ApplySearchToTreeSnapshotOptions<TItem> {
    search: undefined | ((item: TItem) => number | boolean);
    sortSearchByRelevance?: boolean;
}

export interface SortOptions<TItem, TId, TFilter> extends ApplySortOptions<TItem, TId, TFilter> {}

export interface PatchOptions<TItem> {
    items: TItem[];
    isDeletedProp?: keyof TItem;
    comparator?: ItemsComparator<TItem>;
}

export type Position = 'initial' | 'top' | 'bottom';
export interface PatchItemsOptions<TItem, TId> {
    patchItems?: ItemsMap<TId, TItem>;
    isDeletedProp?: keyof TItem;
    getPosition?: (item: TItem) => Position | { after: TId };
}

export interface InsertIntoPositionOptions<TItem, TId> {
    ids: TId[];
    item: TItem;
    position: Position | { after: TId };
}

export interface PatchChildrenOptions<TItem, TId> {
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
    currentCheckedIds: TId[];
    checkedId: TId;
    isChecked: boolean;
    isCheckable?: (item: TItem) => boolean;
    cascadeSelectionType?: CascadeSelection;
}

export interface SelectionOptions<TItem, TId> {
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>,
    checkedId: TId,
    isChecked: boolean,
    isCheckable: (item: TItem) => boolean,
}

export interface ActForCheckableOptions<TItem, TId> {
    action: (id: TId) => void;
    isCheckable: (item: TItem) => boolean;
    id: TId;
}

export interface CheckParentsWithFullCheckOptions<TItem, TId> {
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>,
    checkedId: TId,
    isCheckable: (item: TItem) => boolean,
    removeExplicitChildrenSelection?: boolean,
}
