import { ItemsStorage } from '../../ItemsStorage';
import {
    FilterOptions, LoadAllOptions, LoadOptions, PatchOptions,
    SearchOptions, SortOptions, TreeStructureId, UpdateTreeStructuresOptions, PatchItemsOptions,
} from './types';
import { TreeStructure, FetchingHelper, FilterHelper, SortHelper, SearchHelper, PatchHelper, cloneMap } from '../treeStructure';
import { ItemsMap } from '../../ItemsMap';
import { ItemsAccessor } from '../treeStructure/ItemsAccessor';
import { NOT_FOUND_RECORD } from '../../constants';
import { TreeParams } from '../treeStructure/types';

export class TreeState<TItem, TId> {
    protected constructor(
        private _fullTree: TreeStructure<TItem, TId> | null,
        private _visibleTree: TreeStructure<TItem, TId> | null,
        protected _itemsMap: ItemsMap<TId, TItem>,
        protected _setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {}

    public get itemsMap() {
        return this._itemsMap;
    }

    public get setItems() {
        return this._setItems;
    }

    public get visible() {
        return this._visibleTree;
    }

    public get full() {
        return this._fullTree;
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

        const { loadedItems, byParentId, nodeInfoById } = await FetchingHelper.load<TItem, TId, TFilter>({
            tree: treeStructure,
            options,
            dataSourceState,
            withNestedChildren,
        });

        if (!loadedItems.length && !byParentId.size && !nodeInfoById.size) {
            if (using === undefined && treeStructure !== this.getTreeStructure('visible')) {
                return this.withNewTreeStructures({
                    using,
                    treeStructure,
                    itemsMap: this.itemsMap,
                });
            }

            return this;
        }

        const itemsMap = loadedItems.length ? this.setItems(loadedItems, { on: 'load' }) : this.itemsMap;
        const newByParentId = byParentId.size ? cloneMap(treeStructure.byParentId) : treeStructure.byParentId;
        for (const [id, ids] of byParentId) {
            newByParentId.set(id, ids);
        }

        const newNodeInfoById = nodeInfoById.size ? cloneMap(treeStructure.nodeInfoById) : treeStructure.nodeInfoById;
        for (const [id, nodeInfo] of nodeInfoById) {
            newNodeInfoById.set(id, nodeInfo);
        }
        let treeToUpdate: TreeStructureId = using;
        if (treeToUpdate === 'visible') {
            treeToUpdate = dataSourceState.search ? 'visible' : undefined;
        }

        return this.withNewTreeStructures({
            using: treeToUpdate,
            treeStructure: TreeStructure.create(
                treeStructure.getParams(),
                ItemsAccessor.toItemsAccessor(itemsMap),
                newByParentId,
                newNodeInfoById,
            ),
            itemsMap,
        });
    }

    public async loadAll<TFilter>({
        using,
        options,
        dataSourceState,
    }: LoadAllOptions<TItem, TId, TFilter>): Promise<TreeState<TItem, TId>> {
        const treeStructure = this.getTreeStructure(using);

        const { treeStructure: newTreeStructure, itemsMap: newItemsMap, loadedItems } = await FetchingHelper.loadAll({
            treeStructure,
            itemsMap: this.itemsMap,
            options,
            dataSourceState,
        });

        if (newTreeStructure === treeStructure && newItemsMap === this.itemsMap && !loadedItems.length) {
            return this;
        }

        if (loadedItems.length) {
            this.setItems(loadedItems, { on: 'load' });
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

    public patch({ using, ...options }: PatchOptions<TItem>): TreeState<TItem, TId> {
        const treeStructure = this.getTreeStructure(using);
        const { treeStructure: newTreeStructure, itemsMap: newItemsMap, newItems } = PatchHelper.patch<TItem, TId>({
            treeStructure,
            itemsMap: this.itemsMap,
            ...options,
        });

        if (newTreeStructure === treeStructure && this.itemsMap === newItemsMap && !newItems.length) {
            return this;
        }

        if (newItems.length) {
            this.setItems(newItems, { on: 'patch' });
        }

        return this.withNewTreeStructures({ using, treeStructure: newTreeStructure, itemsMap: newItemsMap });
    }

    public patchItems({ patchItems, isDeletedProp }: PatchItemsOptions<TItem, TId>): TreeState<TItem, TId> {
        const treeStructure = this.getTreeStructure('full');
        const { treeStructure: newTreeStructure, itemsMap: newItemsMap, newItems } = PatchHelper.patchItems({
            treeStructure,
            itemsMap: this.itemsMap,
            patchItems,
            isDeletedProp,
        });

        if (newTreeStructure === treeStructure && newItemsMap === this.itemsMap && !newItems.length) {
            return this;
        }

        if (newItems.length) {
            this.setItems(newItems, { on: 'patch' });
        }

        return this.withNewTreeStructures({ treeStructure: newTreeStructure, itemsMap: newItemsMap });
    }

    private getTreeStructure(treeStructureId: TreeStructureId = 'full') {
        return (treeStructureId ?? 'full') === 'full' ? this._fullTree : this._visibleTree;
    }

    public clearStructure(): TreeState<TItem, TId> {
        return TreeState.create(
            this.full,
            TreeStructure.create(this.visible.getParams(), ItemsAccessor.toItemsAccessor(this.itemsMap)),
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
            : TreeStructure.withNewItemsAccessor(itemsAccessor, this._visibleTree);

        const fullTree = using === 'full'
            ? treeStructure
            : TreeStructure.withNewItemsAccessor(itemsAccessor, this._fullTree);

        return TreeState.create(fullTree, visibleTree, itemsMap, this._setItems);
    }

    public static create<TItem, TId>(
        fullTree: TreeStructure<TItem, TId>,
        visibleTree: TreeStructure<TItem, TId>,
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
        items: TItem[] | undefined,
        itemsMap: ItemsMap<TId, TItem> | undefined,
        params: TreeParams<TItem, TId>,
        setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {
        if (items === undefined && itemsMap === undefined) {
            throw Error('At least one of the following args should be defined: `items` or `itemsMap`.');
        }

        let treeItemsMap: ItemsMap<TId, TItem>;
        if (itemsMap) {
            treeItemsMap = items ? itemsMap.setItems(items) : itemsMap;
        } else {
            treeItemsMap = new ItemsMap(new Map(), params).setItems(items);
        }

        const itemsAccessor = ItemsAccessor.toItemsAccessor(treeItemsMap);
        const treeStructure = TreeStructure.createFromItems({ params, items: items ?? treeItemsMap, itemsAccessor });
        return new TreeState(
            treeStructure,
            treeStructure,
            treeItemsMap,
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
