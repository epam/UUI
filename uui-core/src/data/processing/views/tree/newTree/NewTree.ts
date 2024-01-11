import { ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ItemsComparator, LoadTreeOptions, TreeParams } from '../ITree';
import { CascadeSelection, DataSourceState, IMap } from '../../../../../types';
import { newMap } from '../BaseTree';
import { TreeSnapshot } from './TreeSnapshot';
import { ItemsMap } from '../../../ItemsMap';
import { ItemsStorage } from '../../../ItemsStorage';

export type SnapshotId = 'core' | 'visible';

interface LoadOptions<TItem, TId, TFilter> {
    using?: SnapshotId;
    options: LoadTreeOptions<TItem, TId, TFilter>,
    dataSourceState: Readonly<DataSourceState>,
    withNestedChildren: boolean,
}

interface LoadAllOptions<TItem, TId, TFilter> {
    using?: SnapshotId;
    options: LoadTreeOptions<TItem, TId, TFilter>,
    dataSourceState: Readonly<DataSourceState>,
}

interface UpdateSnapshots<TItem, TId> {
    using?: SnapshotId;
    snapshot: TreeSnapshot<TItem, TId>;
}

interface FilterOptions<TItem, TId, TFilter = any> extends ApplyFilterOptions<TItem, TId, TFilter> {}
interface SortOptions<TItem, TId, TFilter> extends ApplySortOptions<TItem, TId, TFilter> {}
interface SearchOptions<TItem, TId, TFilter> extends ApplySearchOptions<TItem, TId, TFilter> {}

interface CascadeSelectionOptions<TItem, TId> {
    currentCheckedIds: TId[];
    checkedId: TId;
    isChecked: boolean;
    isCheckable?: (item: TItem) => boolean;
    cascadeSelectionType?: CascadeSelection;
}

interface PatchOptions<TItem> {
    using?: SnapshotId;
    items: TItem[];
    isDeletedProp?: keyof TItem;
    comparator?: ItemsComparator<TItem>;
}

export class NewTree<TItem, TId> {
    private constructor(
        protected params: TreeParams<TItem, TId>,
        private _itemsMap: ItemsMap<TId, TItem>,
        private readonly setItems: ItemsStorage<TItem, TId>['setItems'],
        private readonly snapshots: IMap<string, TreeSnapshot<TItem, TId>>,
    ) {}

    public get itemsMap() {
        return this._itemsMap;
    }

    public set itemsMap(itemsMap: ItemsMap<TId, TItem>) {
        this._itemsMap = itemsMap;
        for (const [id, prevSnapshot] of this.snapshots) {
            prevSnapshot.itemsMap = this._itemsMap;
            this.snapshots.set(id, prevSnapshot);
        }
    }

    public async load<TFilter>({
        using,
        options,
        dataSourceState,
        withNestedChildren = true,
    }: LoadOptions<TItem, TId, TFilter>) {
        const treeSnapshot = this.snapshot(using ?? 'core');
        const newTreeSnapshot = await TreeSnapshot.load({ snapshot: treeSnapshot, options, dataSourceState, withNestedChildren });
        return this.updateSnapshots({ using, snapshot: newTreeSnapshot });
    }

    public async loadAll<TFilter>({
        using,
        options,
        dataSourceState,
    }: LoadAllOptions<TItem, TId, TFilter>) {
        const treeSnapshot = this.snapshot(using ?? 'core');
        const newTreeSnapshot = await TreeSnapshot.loadAll({ snapshot: treeSnapshot, options, dataSourceState });
        return this.updateSnapshots({ using, snapshot: newTreeSnapshot });
    }

    public filter<TFilter>({
        filter,
        getFilter,
    }: FilterOptions<TItem, TId, TFilter>): NewTree<TItem, TId> {
        const treeSnapshot = this.snapshot('core');
        const newTreeSnapshot = TreeSnapshot.filter({ snapshot: treeSnapshot, getFilter, filter });

        if (treeSnapshot === newTreeSnapshot) {
            return this;
        }
        return this.updateSnapshots({ snapshot: newTreeSnapshot });
    }

    public sort<TFilter>({
        sorting,
        sortBy,
    }: SortOptions<TItem, TId, TFilter>): NewTree<TItem, TId> {
        const treeSnapshot = this.snapshot('core');
        const newTreeSnapshot = TreeSnapshot.sort({ snapshot: treeSnapshot, sorting, sortBy });

        if (treeSnapshot === newTreeSnapshot) {
            return this;
        }
        return this.updateSnapshots({ snapshot: newTreeSnapshot });
    }

    public search<TFilter>({
        search,
        getSearchFields,
        sortSearchByRelevance,
    }: SearchOptions<TItem, TId, TFilter>): NewTree<TItem, TId> {
        const treeSnapshot = this.snapshot('core');
        const visibleTreeSnapshot = this.snapshot();
        const newTreeSnapshot = TreeSnapshot.search({ snapshot: treeSnapshot, search, getSearchFields, sortSearchByRelevance });

        if (visibleTreeSnapshot === newTreeSnapshot) {
            return this;
        }

        return this.updateSnapshots({ using: 'visible', snapshot: newTreeSnapshot });
    }

    public cascadeSelection(options: CascadeSelectionOptions<TItem, TId>) {
        const treeSnapshot = this.snapshot('core');
        return TreeSnapshot.cascadeSelection({ snapshot: treeSnapshot, ...options });
    }

    public patch({ using, ...options }: PatchOptions<TItem>) {
        const treeSnapshot = this.snapshot(using ?? 'core');
        const newTreeSnapshot = TreeSnapshot.patch({ snapshot: treeSnapshot, ...options });

        if (newTreeSnapshot === treeSnapshot) {
            return this;
        }

        return this.updateSnapshots({ using, snapshot: newTreeSnapshot });
    }

    private updateSnapshots({ using, snapshot }: UpdateSnapshots<TItem, TId>): NewTree<TItem, TId> {
        const newSnapshots = newMap<string, TreeSnapshot<TItem, TId>>(this.params);
        const newItemsMap = snapshot.itemsMap;
        if (using === undefined) {
            for (const [id] of this.snapshots) {
                newSnapshots.set(id, snapshot);
            }
        } else {
            for (const [id, prevSnapshot] of this.snapshots) {
                prevSnapshot.itemsMap = newItemsMap;
                newSnapshots.set(id, prevSnapshot);
            }
            newSnapshots.set(using, snapshot);
        }

        return NewTree.newInstance(this.params, newItemsMap, newSnapshots);
    }

    private static newInstance<TItem, TId>(
        params: TreeParams<TItem, TId>,
        itemsMap: ItemsMap<TId, TItem>,
        snapshots: IMap<string, TreeSnapshot<TItem, TId>>,
    ) {
        return new (this as any)(
            params,
            itemsMap,
            snapshots,
        );
    }

    public static create<TItem, TId>(
        params: TreeParams<TItem, TId>,
        itemsMap: ItemsMap<TId, TItem>,
        setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {
        const snapshot = TreeSnapshot.create(params, itemsMap, setItems);
        const snapshots = newMap<string, TreeSnapshot<TItem, TId>>(params);
        snapshots.set('core', snapshot);
        snapshots.set('visible', snapshot);
        return this.newInstance(
            params,
            snapshot.itemsMap,
            snapshots,
        );
    }

    public snapshot(id: SnapshotId = 'visible') {
        if (!this.snapshots.has(id)) {
            const newSnapshot = TreeSnapshot.newInstance(this.params, this.itemsMap, this.setItems);
            this.snapshots.set(id, newSnapshot);
        }
        return this.snapshots.get(id);
    }

    public static blank<TItem, TId>(params: TreeParams<TItem, TId>, itemsMap: ItemsMap<TId, TItem>, setItems: ItemsStorage<TItem, TId>['setItems']) {
        return new this(
            params,
            itemsMap,
            setItems,
            newMap(params),
        );
    }

    public clearStructure(ofSnapshot?: SnapshotId): NewTree<TItem, TId> {
        const newSnapshots = newMap<string, TreeSnapshot<TItem, TId>>(this.params);
        if (ofSnapshot === undefined) {
            for (const [id] of this.snapshots) {
                newSnapshots.set(id, TreeSnapshot.newInstance(this.params, this.itemsMap, this.setItems));
            }
        } else {
            for (const [id, prevSnapshot] of this.snapshots) {
                newSnapshots.set(id, prevSnapshot);
            }
            newSnapshots.set(ofSnapshot, TreeSnapshot.newInstance(this.params, this.itemsMap, this.setItems));
        }

        return NewTree.newInstance(this.params, this.itemsMap, newSnapshots);
    }

    public reset(toSnapshot: SnapshotId = 'core'): NewTree<TItem, TId> {
        const newSnapshots = newMap<string, TreeSnapshot<TItem, TId>>(this.params);
        const snapshot = this.snapshot(toSnapshot);
        for (const [id, prevSnapshot] of this.snapshots) {
            if (id !== toSnapshot) {
                newSnapshots.set(id, snapshot);
            } else {
                newSnapshots.set(id, prevSnapshot);
            }
        }

        return NewTree.newInstance(this.params, this.itemsMap, newSnapshots);
    }
}
