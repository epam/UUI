import { DataSourceState, SortingOption, DataRowPathItem, CascadeSelection } from '../../../../types';
import { LazyListViewProps } from '../LazyListView';
import { CompositeKeysMap } from './CompositeKeysMap';

export const ROOT_ID: undefined = undefined;

export interface ApplyFilterOptions<TItem, TId, TFilter> {
    filter: DataSourceState<TFilter, TId>['filter'];
    getFilter?: (filter: TFilter) => (item: TItem) => boolean;
}

export interface ApplySearchOptions<TItem, TId, TFilter> {
    search: DataSourceState<TFilter, TId>['search'];
    getSearchFields?: (item: TItem) => string[];
}

export interface ApplySortOptions<TItem, TId, TFilter> {
    sorting: DataSourceState<TFilter, TId>['sorting'];
    sortBy?(item: TItem, sorting: SortingOption): any;
}

export interface TreeNodeInfo {
    count?: number;
}

export interface LoadTreeOptions<TItem, TId, TFilter>
    extends Pick<LazyListViewProps<TItem, TId, TFilter>, 'api' | 'getChildCount' | 'filter' | 'fetchStrategy' | 'flattenSearchResults'> {
    loadAllChildren?(id: TId): boolean;
    isFolded?: (item: TItem) => boolean;
}

export interface TreeParams<TItem, TId> {
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;
}

export type ItemsComparator<TItem> = (newItem: TItem, existingItem: TItem) => number;

export interface ITree<TItem, TId> {
    clearStructure(): ITree<TItem, TId>;
    getRootIds(): TId[];
    getRootItems(): TItem[];
    getById(id: TId): TItem;
    getChildren(item: TItem): TItem[];
    getChildrenByParentId(parentId: TId): TItem[];
    getChildrenIdsByParentId(parentId: TId): TId[];
    getParentIdsRecursive(id: TId): TId[];
    getParents(id: TId): TItem[];
    getPathById(id: TId): DataRowPathItem<TId, TItem>[];
    getPathItem(item: TItem): DataRowPathItem<TId, TItem>;
    getNodeInfo(id: TId): TreeNodeInfo;
    isFlatList(): boolean;

    patch(items: TItem[], isDeletedProp?: keyof TItem, comparator?: ItemsComparator<TItem>): ITree<TItem, TId>;
    cascadeSelection(
        currentSelection: TId[],
        selectedId: TId,
        isSelected: boolean,
        options?: {
            isSelectable?: (item: TItem) => boolean;
            cascade?: CascadeSelection;
        }
    ): TId[];

    load<TFilter>(options: LoadTreeOptions<TItem, TId, TFilter>, value: Readonly<DataSourceState>, withNestedChildren?: boolean): Promise<ITree<TItem, TId>>;

    loadMissing<TFilter>(options: LoadTreeOptions<TItem, TId, TFilter>, value: Readonly<DataSourceState>): Promise<ITree<TItem, TId>>;

    loadMissingIdsAndParents<TFilter>(options: LoadTreeOptions<TItem, TId, TFilter>, idsToLoad: TId[]): Promise<ITree<TItem, TId>>;

    getTotalRecursiveCount(): number;
    forEach(
        action: (item: TItem, id: TId, parentId: TId, stop: () => void) => void,
        options?: {
            direction?: 'bottom-up' | 'top-down';
            parentId?: TId;
            includeParent?: boolean;
        }
    ): void;
    computeSubtotals<TSubtotals>(
        get: (item: TItem, hasChildren: boolean) => TSubtotals,
        add: (a: TSubtotals, b: TSubtotals) => TSubtotals
    ): CompositeKeysMap<TId, TSubtotals> | Map<TId, TSubtotals>;

    filter<TFilter>(options: ApplyFilterOptions<TItem, TId, TFilter>): ITree<TItem, TId>;
    search<TFilter>(options: ApplySearchOptions<TItem, TId, TFilter>): ITree<TItem, TId>;
    sort<TFilter>(options: ApplySortOptions<TItem, TId, TFilter>): ITree<TItem, TId>;
}
