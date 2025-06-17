import { CascadeSelection, DataSourceState, IMap, IImmutableMap } from '../../../../../../types';
import { TreeStructure } from '../TreeStructure';
import { CompositeKeysMap } from '../../helpers';
import { LazyListViewProps } from '../../../types';
import { ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ExtendedPatchOptions, ItemsComparator, LoadTreeOptions } from '../../treeState/types';
import { ItemsMap } from '../../ItemsMap';
import { ITree } from '../../ITree';
import { NOT_FOUND_RECORD } from '../../constants';
import { IItemsAccessor, ITreeParams } from '../types';

export interface ActForCheckableOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    action: (id: TId) => void;
    isCheckable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => boolean;
    id: TId;
}

export interface CascadeSelectionOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    currentCheckedIds: TId[];
    checkedId: TId;
    isChecked: boolean;
    isCheckable?: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => boolean;
    isUnknown?: (id: TId) => boolean;
    cascadeSelectionType?: CascadeSelection;
}

export interface CheckParentsWithFullCheckOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>;
    checkedId: TId;
    isCheckable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => boolean;
    removeExplicitChildrenSelection?: boolean;
}

export interface ClearIfTreeNotLoadedOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>;
    checkedId: TId;
    isCheckable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => boolean;
}

export interface ClearUnknownItemsOptions<TId> {
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>;
    isUnknown: (id: TId) => boolean;
}

export interface SelectionOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>;
    checkedId: TId;
    isChecked: boolean;
    isCheckable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => boolean;
}

export interface ClearAllOptions<TItem, TId> {
    tree: ITree<TItem, TId>;
    checkedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>;
    isCheckable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => boolean;
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
    byParentId: IMap<TId, TId[]>;
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
}

export interface LoadOptions<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>;
    dataSourceState: Readonly<DataSourceState>;
    patch?: IMap<TId, TItem> | IImmutableMap<TId, TItem>;
}

export interface SortOptions<TItem, TId, TFilter> extends Omit<ApplySortOptions<TItem, TId, TFilter>, 'getId'>, CreateTreeInstance<TItem, TId> {
    tree: ITree<TItem, TId>;
}

export interface ApplySearchToTreeSnapshotOptions<TItem, TId> extends CreateTreeInstance<TItem, TId> {
    tree: ITree<TItem, TId>;
    search: undefined | ((item: TItem) => number | boolean);
    sortSearchByRelevance?: boolean;
}

export interface CreateTreeInstanceOptions<TItem, TId> {
    params: ITreeParams<TItem, TId>;
    items: TItem[] | ItemsMap<TId, TItem>;
    itemsAccessor: IItemsAccessor<TItem, TId>;
}

/**
 * Create new ITree instance interface.
 */
export interface CreateTreeInstance<TItem, TId> {
    /**
     * Create a new ITree instance.
     */
    newTreeInstance?: (options: CreateTreeInstanceOptions<TItem, TId>) => ITree<TItem, TId>;
}

export interface SearchOptions<TItem, TId, TFilter> extends ApplySearchOptions<TItem, TId, TFilter>, CreateTreeInstance<TItem, TId> {
    tree: ITree<TItem, TId>;
}

export interface PatchIntoTreeStructureOptions<TItem, TId> extends Omit<ExtendedPatchOptions<TItem, TId>, 'getNewItemPosition'> {
    treeStructure: TreeStructure<TItem, TId>;
    itemsMap: ItemsMap<TId, TItem>;
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
    isDeleted?: () => boolean;
    comparator?: ItemsComparator<TItem>;
}

export interface FilterOptions<TItem, TId, TFilter = any> extends ApplyFilterOptions<TItem, TId, TFilter>, CreateTreeInstance<TItem, TId> {
    tree: ITree<TItem, TId>;
}

export interface ApplyFilterToTreeSnapshotOptions<TItem, TId> extends CreateTreeInstance<TItem, TId> {
    tree: ITree<TItem, TId>;
    filter: undefined | ((item: TItem) => number | boolean);
}
