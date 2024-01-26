import { CascadeSelection, DataSourceState, IMap } from '../../../../../../../types';
import { TreeStructure } from '../TreeStructure';
import { CompositeKeysMap } from './map';
import { LazyListViewProps } from '../../../../types';
import { ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ItemsComparator, LoadTreeOptions } from '../../treeState/types';
import { ItemsMap } from '../../../ItemsMap';
import { TreeParams } from '../types';
import { ITree } from '../../ITree';

export interface ActForCheckableOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    action: (id: TId) => void;
    isCheckable: (item: TItem) => boolean;
    id: TId;
}

export interface CascadeSelectionOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    currentCheckedIds: TId[];
    checkedId: TId;
    isChecked: boolean;
    isCheckable?: (item: TItem) => boolean;
    cascadeSelectionType?: CascadeSelection;
}

export interface CheckParentsWithFullCheckOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>;
    checkedId: TId;
    isCheckable: (item: TItem) => boolean;
    removeExplicitChildrenSelection?: boolean;
}

export interface SelectionOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>;
    checkedId: TId;
    isChecked: boolean;
    isCheckable: (item: TItem) => boolean;
}

export interface LoadAllTreeOptions<TItem, TId, TFilter> extends Pick<LazyListViewProps<TItem, TId, TFilter>, 'api' | 'filter'> {}

export interface LoadAllOptions<TItem, TId, TFilter = any> {
    treeStructure: TreeStructure<TItem, TId>;
    itemsMap: ItemsMap<TId, TItem>;
    options: LoadAllTreeOptions<TItem, TId, TFilter>;
    dataSourceState: DataSourceState;
}

export interface LoadItemsOptions<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>,
    parentId: TId,
    parent: TItem,
    dataSourceState: Readonly<DataSourceState>,
    remainingRowsCount: number,
    loadAll: boolean,
}

export interface LoadMissingItemsAndParentsOptions<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    newItemsMap: IMap<TId, TItem>;
    options: LoadTreeOptions<TItem, TId, TFilter>;
    itemsToLoad: TId[];
}

export interface LoadOptionsMissing<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>;
    dataSourceState: Readonly<DataSourceState>;
    withNestedChildren: boolean;
}

export interface LoadOptions<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>;
    dataSourceState: Readonly<DataSourceState>;
    withNestedChildren: boolean;
}

export interface SortOptions<TItem, TId, TFilter> extends ApplySortOptions<TItem, TId, TFilter> {
    treeStructure: TreeStructure<TItem, TId>;
}

export interface ApplySearchToTreeSnapshotOptions<TItem, TId> {
    treeStructure: TreeStructure<TItem, TId>;
    search: undefined | ((item: TItem) => number | boolean);
    sortSearchByRelevance?: boolean;
}

export interface SearchOptions<TItem, TId, TFilter> extends ApplySearchOptions<TItem, TId, TFilter> {
    treeStructure: TreeStructure<TItem, TId>;
}

export type Position = 'initial' | 'top' | 'bottom';
export interface PatchItemsOptions<TItem, TId> {
    treeStructure: TreeStructure<TItem, TId>;
    itemsMap: ItemsMap<TId, TItem>;
    patchItems?: ItemsMap<TId, TItem>;
    isDeletedProp?: keyof TItem;
    getPosition?: (item: TItem) => Position | { after: TId };
}

export interface InsertIntoPositionOptions<TItem, TId> {
    params: TreeParams<TItem, TId>;
    ids: TId[];
    item: TItem;
    position: Position | { after: TId };
}

export interface PatchChildrenOptions<TItem, TId> {
    treeStructure: TreeStructure<TItem, TId>;
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

export interface PatchOptions<TItem, TId> {
    treeStructure: TreeStructure<TItem, TId>;
    itemsMap: ItemsMap<TId, TItem>;
    items: TItem[];
    isDeletedProp?: keyof TItem;
    comparator?: ItemsComparator<TItem>;
}

export interface FilterOptions<TItem, TId, TFilter = any> extends ApplyFilterOptions<TItem, TId, TFilter> {
    treeStructure: TreeStructure<TItem, TId>;
}

export interface ApplyFilterToTreeSnapshotOptions<TItem, TId> {
    treeStructure: TreeStructure<TItem, TId>;
    filter: undefined | ((item: TItem) => number | boolean);
}
