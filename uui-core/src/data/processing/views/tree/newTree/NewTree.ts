import { ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ItemsComparator, LoadTreeOptions, TreeParams } from '..';
import { CascadeSelection, DataSourceState, IMap } from '../../../../../types';
import { newMap } from '../BaseTree';
import { TreeSnapshot } from './TreeSnapshot';

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
    snapshot: TreeSnapshot<TItem, TId>;
    currentCheckedIds: TId[];
    checkedId: TId;
    isChecked: boolean;
    isCheckable?: (item: TItem) => boolean;
    cascadeSelectionType?: CascadeSelection;
}

interface PatchOptions<TItem, TId> {
    using?: SnapshotId;
    snapshot: TreeSnapshot<TItem, TId>;
    items: TItem[];
    isDeletedProp?: keyof TItem;
    comparator?: ItemsComparator<TItem>;
}

export class NewTree<TItem, TId> {
    private constructor(
        protected params: TreeParams<TItem, TId>,
        private readonly byId: IMap<TId, TItem>,
        private readonly snapshots: IMap<string, TreeSnapshot<TItem, TId>>,
    ) {}

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
    }: FilterOptions<TItem, TId, TFilter>) {
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
    }: SortOptions<TItem, TId, TFilter>) {
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
    }: SearchOptions<TItem, TId, TFilter>) {
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

    public patch({ using = 'visible', ...options }: PatchOptions<TItem, TId>) {
        const treeSnapshot = this.snapshot(using);
        const newTreeSnapshot = TreeSnapshot.patch({ snapshot: treeSnapshot, ...options });

        if (newTreeSnapshot === treeSnapshot) {
            return this;
        }

        return this.updateSnapshots({ using, snapshot: newTreeSnapshot });
    }

    private updateSnapshots({ using, snapshot }: UpdateSnapshots<TItem, TId>) {
        const newSnapshots = newMap<string, TreeSnapshot<TItem, TId>>(this.params);
        const newById = snapshot.byId;
        if (using === undefined) {
            for (const [id] of this.snapshots) {
                newSnapshots.set(id, snapshot);
            }
        } else {
            for (const [id, prevSnapshot] of this.snapshots) {
                prevSnapshot.byId = newById;
                newSnapshots.set(id, prevSnapshot);
            }
            newSnapshots.set(using, snapshot);
        }

        return this.newInstance(this.params, newById, newSnapshots);
    }

    private newInstance(
        params: TreeParams<TItem, TId>,
        byId: IMap<TId, TItem>,
        snapshots: IMap<string, TreeSnapshot<TItem, TId>>,
    ) {
        return new (this as any)(
            params,
            byId,
            snapshots,
        );
    }

    public snapshot(id: SnapshotId = 'visible') {
        if (!this.snapshots.has(id)) {
            const newSnapshot = TreeSnapshot.newInstance(this.params, this.byId);
            this.snapshots.set(id, newSnapshot);
        }
        return this.snapshots.get(id);
    }
}
