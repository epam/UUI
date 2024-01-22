import { ItemsStorage } from '../../ItemsStorage';
import {
    CascadeSelectionOptions, FilterOptions, LoadAllOptions, LoadOptions, PatchOptions,
    SearchOptions, SortOptions, TreeStructureId, UpdateTreeStructuresOptions, PatchItemsOptions,
} from './ITreeState';
import { PureTreeState } from './PureTreeState';
import { TreeStructure, ITreeStructure, TreeParams, FetchingHelper, FilterHelper, SortHelper, SearchHelper, CheckingHelper, PatchHelper } from '../treeStructure';
import { ItemsMap } from '../../ItemsMap';
import { ItemsAccessor } from '../treeStructure/ItemsAccessor';
import { NOT_FOUND_RECORD } from '../constants';

export class TreeState<TItem, TId> extends PureTreeState<TItem, TId> implements TreeState<TItem, TId> {
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

    public get itemsMap() {
        return this._itemsMap;
    }

    public get setItems() {
        return this._setItems;
    }

    public get visible() {
        return this._visibleTreeStructure;
    }

    public get full() {
        return this._fullTreeStructure;
    }

    public getById(id: TId) {
        return this.itemsMap.has(id) ? this.itemsMap.get(id) : NOT_FOUND_RECORD;
    }

    public async load<TFilter>({
        using,
        options,
        dataSourceState,
        withNestedChildren = true,
    }: LoadOptions<TItem, TId, TFilter>): Promise<TreeState<TItem, TId>> {
        const treeStructure = this.getTreeStructure(using);

        const { treeStructure: newTreeStructure, itemsMap: newItemsMap } = await FetchingHelper.load<TItem, TId, TFilter>({
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
    }: LoadAllOptions<TItem, TId, TFilter>): Promise<TreeState<TItem, TId>> {
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
    }: FilterOptions<TItem, TId, TFilter>): TreeState<TItem, TId> {
        const treeStructure = this.getTreeStructure('full');
        const newTreeStructure = FilterHelper.filter<TItem, TId, TFilter>({ treeStructure, getFilter, filter });

        if (treeStructure === newTreeStructure) {
            return this;
        }

        return this.withNewTreeStructures({ treeStructure: newTreeStructure, itemsMap: this.itemsMap });
    }

    public sort<TFilter>({
        sorting,
        sortBy,
    }: SortOptions<TItem, TId, TFilter>): TreeState<TItem, TId> {
        const treeStructure = this.getTreeStructure('full');
        const newTreeStructure = SortHelper.sort<TItem, TId, TFilter>({ treeStructure, sorting, sortBy });

        if (treeStructure === newTreeStructure) {
            return this;
        }

        return this.withNewTreeStructures({ treeStructure: newTreeStructure, itemsMap: this.itemsMap });
    }

    public search<TFilter>({
        search,
        getSearchFields,
        sortSearchByRelevance,
    }: SearchOptions<TItem, TId, TFilter>): TreeState<TItem, TId> {
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

    public patch({ using, ...options }: PatchOptions<TItem>): TreeState<TItem, TId> {
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

    public patchItems({ patchItems, isDeletedProp }: PatchItemsOptions<TItem, TId>): TreeState<TItem, TId> {
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

    public clearStructure(): TreeState<TItem, TId> {
        return TreeState.create(
            TreeStructure.create(this.full.params, ItemsAccessor.toItemsAccessor(this.itemsMap)),
            TreeStructure.create(this.visible.params, ItemsAccessor.toItemsAccessor(this.itemsMap)),
            this.itemsMap,
            this.setItems,
        );
    }

    public reset(): TreeState<TItem, TId> {
        return TreeState.create(
            this.full,
            this.full,
            this.itemsMap,
            this.setItems,
        );
    }

    private withNewTreeStructures({
        using,
        treeStructure,
        itemsMap,
    }: UpdateTreeStructuresOptions<TItem, TId>): TreeState<TItem, TId> {
        if (!using) {
            return TreeState.create(treeStructure, treeStructure, itemsMap, this._setItems);
        }
        const itemsAccessor = ItemsAccessor.toItemsAccessor(itemsMap);
        const visibleTree = using === 'visible'
            ? treeStructure
            : TreeStructure.withNewItemsAccessor(itemsAccessor, this._visibleTreeStructure);

        const fullTree = using === 'full'
            ? treeStructure
            : TreeStructure.withNewItemsAccessor(itemsAccessor, this._fullTreeStructure);

        return TreeState.create(fullTree, visibleTree, itemsMap, this._setItems);
    }

    public static toPureTreeState<TItem, TId>(treeState: TreeState<TItem, TId>) {
        return new PureTreeState(
            treeState._fullTree,
            treeState._visibleTree,
            treeState._itemsMap,
            treeState._setItems,
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

    public static blank<TItem, TId>(params: TreeParams<TItem, TId>, itemsMap: ItemsMap<TId, TItem>, setItems: ItemsStorage<TItem, TId>['setItems']): TreeState<TItem, TId> {
        const treeStructure = TreeStructure.create(params, ItemsAccessor.toItemsAccessor(itemsMap));

        return this.create(
            treeStructure,
            treeStructure,
            itemsMap,
            setItems,
        );
    }
}
