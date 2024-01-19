import { CascadeSelection, DataSourceState } from '../../../../../../types';
import { ItemsMap } from '../../../../../processing/ItemsMap';
import { ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ItemsComparator, LoadTreeOptions } from '../../ITree';
import { ITreeStructure } from '../treeStructure/ITreeStructure';
import { PatchItemsOptions } from '../types';

export type TreeStructureId = 'full' | 'visible';

export interface LoadOptions<TItem, TId, TFilter> {
    using?: TreeStructureId;
    options: LoadTreeOptions<TItem, TId, TFilter>,
    dataSourceState: Readonly<DataSourceState>,
    withNestedChildren: boolean,
}

export interface LoadAllOptions<TItem, TId, TFilter> {
    using?: TreeStructureId;
    options: LoadTreeOptions<TItem, TId, TFilter>,
    dataSourceState: Readonly<DataSourceState>,
}

export interface UpdateTreeStructuresOptions<TItem, TId> {
    using?: TreeStructureId;
    treeStructure: ITreeStructure<TItem, TId>;
    itemsMap: ItemsMap<TId, TItem>;
}

export interface FilterOptions<TItem, TId, TFilter = any> extends ApplyFilterOptions<TItem, TId, TFilter> {}
export interface SortOptions<TItem, TId, TFilter> extends ApplySortOptions<TItem, TId, TFilter> {}
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
    isDeletedProp?: keyof TItem;
    comparator?: ItemsComparator<TItem>;
}

export interface ITreeState<TItem, TId> {
    load<TFilter>({
        using,
        options,
        dataSourceState,
        withNestedChildren,
    }: LoadOptions<TItem, TId, TFilter>): Promise<ITreeState<TItem, TId>>;

    loadAll<TFilter>({
        using,
        options,
        dataSourceState,
    }: LoadAllOptions<TItem, TId, TFilter>): Promise<ITreeState<TItem, TId>>;

    filter<TFilter>({ filter, getFilter }: FilterOptions<TItem, TId, TFilter>): ITreeState<TItem, TId>;
    sort<TFilter>({ sorting, sortBy }: SortOptions<TItem, TId, TFilter>): ITreeState<TItem, TId>;
    search<TFilter>({ search, getSearchFields, sortSearchByRelevance }: SearchOptions<TItem, TId, TFilter>): ITreeState<TItem, TId>;
    cascadeSelection(options: CascadeSelectionOptions<TItem, TId>): TId[];
    patch({ using, ...options }: PatchOptions<TItem>): ITreeState<TItem, TId>;
    patchItems({ patchItems, isDeletedProp }: PatchItemsOptions<TItem, TId>): ITreeState<TItem, TId>;
}
