import { ItemsMap } from '../../../../../processing/ItemsMap';
import { ItemsStorage } from '../../../../../processing/ItemsStorage';
import { TreeParams } from '../../ITree';
import { ITreeStructure } from '../treeStructure/ITreeStructure';
import { CascadeSelectionOptions, FilterOptions, ITreeState, LoadAllOptions, LoadOptions, PatchOptions, SearchOptions, SortOptions, TreeStructureId, UpdateTreeStructuresOptions } from './ITreeState';
import { PureTreeState } from './PureTreeState';
import { FetchingHelper } from '../treeStructure/helpers/FetchingHelper';
import { TreeStructure } from '../treeStructure/TreeStructure';
import { ItemsAccessor } from '../ItemsAccessor';
import { FilterHelper } from '../treeStructure/helpers/FilterHelper';
import { SortHelper } from '../treeStructure/helpers/SortHelper';
import { SearchHelper } from '../treeStructure/helpers/SearchHelper';
import { CheckingHelper } from '../treeStructure/helpers/CheckingHelper';
import { PatchHelper } from '../treeStructure/helpers/PatchHelper';
import { PatchItemsOptions } from '../types';

export class TreeState<TItem, TId> extends PureTreeState<TItem, TId> implements ITreeState<TItem, TId> {
    protected constructor(
        private _fullTreeStructure: ITreeStructure<TItem, TId> | null,
        private _visibleTreeStructure: ITreeStructure<TItem, TId> | null,
        protected _itemsMap: ItemsMap<TId, TItem>,
        protected _setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {
        super(
            TreeStructure.toPureTreeStructure(_fullTreeStructure),
            TreeStructure.toPureTreeStructure(_visibleTreeStructure),
            _itemsMap,
            _setItems,
        );
    }

    public async load<TFilter>({
        using,
        options,
        dataSourceState,
        withNestedChildren = true,
    }: LoadOptions<TItem, TId, TFilter>): Promise<ITreeState<TItem, TId>> {
        const treeStructure = this.getTreeStructure(using);

        const { treeStructure: newTreeStructure, itemsMap: newItemsMap } = await FetchingHelper.load({
            treeStructure,
            itemsMap: this.itemsMap,
            options,
            dataSourceState,
            withNestedChildren,
        });

        if (newTreeStructure === treeStructure && newItemsMap === this.itemsMap) {
            return this;
        }

        return this.withNewTreeStructures({ using, treeStructure: newTreeStructure, itemsMap: newItemsMap });
    }

    public async loadAll<TFilter>({
        using,
        options,
        dataSourceState,
    }: LoadAllOptions<TItem, TId, TFilter>): Promise<ITreeState<TItem, TId>> {
        const treeStructure = this.getTreeStructure(using);

        const { treeStructure: newTreeStructure, itemsMap: newItemsMap } = await FetchingHelper.loadAll({
            treeStructure,
            itemsMap: this.itemsMap,
            options,
            dataSourceState,
        });

        if (newTreeStructure === treeStructure && newItemsMap === this.itemsMap) {
            return this;
        }

        return this.withNewTreeStructures({ using, treeStructure: newTreeStructure, itemsMap: newItemsMap });
    }

    public filter<TFilter>({
        filter,
        getFilter,
    }: FilterOptions<TItem, TId, TFilter>): ITreeState<TItem, TId> {
        const treeStructure = this.getTreeStructure('full');
        const newTreeStructure = FilterHelper.filter({ treeStructure, getFilter, filter });

        if (treeStructure === newTreeStructure) {
            return this;
        }

        return this.withNewTreeStructures({ treeStructure: newTreeStructure, itemsMap: this.itemsMap });
    }

    public sort<TFilter>({
        sorting,
        sortBy,
    }: SortOptions<TItem, TId, TFilter>): ITreeState<TItem, TId> {
        const treeStructure = this.getTreeStructure('full');
        const newTreeStructure = SortHelper.sort({ treeStructure, sorting, sortBy });

        if (treeStructure === newTreeStructure) {
            return this;
        }

        return this.withNewTreeStructures({ treeStructure: newTreeStructure, itemsMap: this.itemsMap });
    }

    public search<TFilter>({
        search,
        getSearchFields,
        sortSearchByRelevance,
    }: SearchOptions<TItem, TId, TFilter>): ITreeState<TItem, TId> {
        const treeStructure = this.getTreeStructure('full');
        const newTreeStructure = SearchHelper.search({ treeStructure, search, getSearchFields, sortSearchByRelevance });

        if (newTreeStructure === treeStructure) {
            return this;
        }

        return this.withNewTreeStructures({ using: 'visible', treeStructure: newTreeStructure, itemsMap: this.itemsMap });
    }

    public cascadeSelection(options: CascadeSelectionOptions<TItem, TId>) {
        const treeStructure = this.getTreeStructure('full');
        return CheckingHelper.cascadeSelection<TItem, TId>({ treeStructure, itemsMap: this.itemsMap, ...options });
    }

    public patch({ using, ...options }: PatchOptions<TItem>): ITreeState<TItem, TId> {
        const treeStructure = this.getTreeStructure(using);
        const { treeStructure: newTreeStructure, itemsMap: newItemsMap } = PatchHelper.patch<TItem, TId>({
            treeStructure,
            itemsMap: this.itemsMap,
            ...options,
        });

        if (newTreeStructure === treeStructure && this.itemsMap === newItemsMap) {
            return this;
        }

        return this.withNewTreeStructures({ using, treeStructure: newTreeStructure, itemsMap: newItemsMap });
    }

    public patchItems({ patchItems, isDeletedProp }: PatchItemsOptions<TItem, TId>): ITreeState<TItem, TId> {
        const treeStructure = this.getTreeStructure('full');
        const { treeStructure: newTreeStructure, itemsMap: newItemsMap } = PatchHelper.patchItems({
            treeStructure,
            itemsMap: this.itemsMap,
            patchItems,
            isDeletedProp,
        });

        if (newTreeStructure === treeStructure && newItemsMap === this.itemsMap) {
            return this;
        }

        return this.withNewTreeStructures({ treeStructure: newTreeStructure, itemsMap: newItemsMap });
    }

    private getTreeStructure(treeStructureId: TreeStructureId = 'full') {
        return (treeStructureId ?? 'full') === 'full' ? this._fullTreeStructure : this._visibleTreeStructure;
    }

    private withNewTreeStructures({
        using,
        treeStructure,
        itemsMap,
    }: UpdateTreeStructuresOptions<TItem, TId>): ITreeState<TItem, TId> {
        if (!using) {
            return TreeState.create(treeStructure, treeStructure, itemsMap, this.setItems);
        }
        const itemsAccessor = ItemsAccessor.toItemsAccessor(itemsMap);
        const visibleTree = using === 'visible'
            ? treeStructure
            : TreeStructure.withNewItemsAccessor(itemsAccessor, this._visibleTreeStructure);

        const fullTree = using === 'full'
            ? treeStructure
            : TreeStructure.withNewItemsAccessor(itemsAccessor, this._fullTreeStructure);

        return TreeState.create(fullTree, visibleTree, itemsMap, this.setItems);
    }

    public static toPureTreeState<TItem, TId>(treeState: TreeState<TItem, TId>) {
        return new PureTreeState(
            treeState.fullTree,
            treeState.visibleTree,
            treeState.itemsMap,
            treeState.setItems,
        );
    }

    public static create<TItem, TId>(
        fullTree: ITreeStructure<TItem, TId>,
        visibleTree: ITreeStructure<TItem, TId>,
        itemsMap: ItemsMap<TId, TItem>,
        setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {
        return new TreeState(
            fullTree,
            visibleTree,
            itemsMap,
            setItems,
        );
    }

    public static createFromItems<TItem, TId>(
        params: TreeParams<TItem, TId>,
        items: TItem[] | ItemsMap<TId, TItem>,
        setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {
        const itemsMap = items instanceof ItemsMap
            ? items
            : new ItemsMap(new Map(), params.getId).setItems(items);

        const itemsAccessor = ItemsAccessor.toItemsAccessor(itemsMap);
        const treeStructure = TreeStructure.createFromItems({ params, items: itemsMap, itemsAccessor });
        return new TreeState(
            treeStructure,
            treeStructure,
            itemsMap,
            setItems,
        );
    }

    public static blank<TItem, TId>(params: TreeParams<TItem, TId>, itemsMap: ItemsMap<TId, TItem>, setItems: ItemsStorage<TItem, TId>['setItems']) {
        const treeStructure = TreeStructure.create(params, ItemsAccessor.toItemsAccessor(itemsMap));

        return this.create(
            treeStructure,
            treeStructure,
            itemsMap,
            setItems,
        );
    }
}
