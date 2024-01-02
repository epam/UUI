import { LoadTreeOptions, TreeParams } from '..';
import { DataSourceState, IMap } from '../../../../../types';
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
        const treeSnapshot = this.snapshots.get(using ?? 'core');
        const newTreeSnapshot = await TreeSnapshot.load({ snapshot: treeSnapshot, options, dataSourceState, withNestedChildren });
        return this.updateSnapshots({ using, snapshot: newTreeSnapshot });
    }

    public async loadAll<TFilter>({
        using,
        options,
        dataSourceState,
    }: LoadAllOptions<TItem, TId, TFilter>) {
        const treeSnapshot = this.snapshots.get(using ?? 'core');
        const newTreeSnapshot = await TreeSnapshot.loadAll({ snapshot: treeSnapshot, options, dataSourceState });
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

    public snapshot(id: SnapshotId = 'core') {
        if (!this.snapshots.has(id)) {
            const newSnapshot = new TreeSnapshot(this.params, this.byId);
            this.snapshots.set(id, newSnapshot);
        }
        return this.snapshots.get(id);
    }
}
