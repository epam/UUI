import { EMPTY, FULLY_LOADED, ITree, NOT_FOUND_RECORD, PARTIALLY_LOADED,
    TreeNodeInfo, TreeParams, ItemsInfo, TreeNodeStatus, IMap } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export class Tree implements ITree<Location, string> {
    constructor(
        public params: TreeParams<Location, string>,
        protected itemsMap: Map<string, Location> = new Map(),
        protected byParentId: Map<string, string[]> = new Map(),
        protected nodeInfoById: Map<string, TreeNodeInfo> = new Map(),
    ) {}

    public getItems(parentId?: string): ItemsInfo<string> {
        const ids = this.byParentId.get(parentId) ?? [];
        const { count, totalCount } = this.nodeInfoById.get(parentId) ?? {};

        let status: TreeNodeStatus = count === undefined ? PARTIALLY_LOADED : EMPTY;
        if (count !== 0 && ids.length === count) {
            status = FULLY_LOADED;
        }

        return { ids, count, totalCount, status };
    }

    getById(id: string): Location | typeof NOT_FOUND_RECORD {
        return this.itemsMap.has(id) ? this.itemsMap.get(id) : NOT_FOUND_RECORD;
    }

    public getTotalCount() {
        let count = undefined;
        for (const [, info] of this.nodeInfoById) {
            if (info.count == null) {
                // TBD: getTotalCount() is used for totalCount, but we can't have correct count until all branches are loaded
                return null;
            } else {
                if (count === undefined) {
                    count = 0;
                }
                count += info.count;
            }
        }
        return count;
    }

    public static blank(params: TreeParams<Location, string>) {
        return new Tree(params);
    }

    public update(items: Location[], newByParentId: IMap<string, string[]>, newNodeInfoById: IMap<string, TreeNodeInfo>) {
        const itemsMap = items.length ? new Map(this.itemsMap) : this.itemsMap;

        items.forEach((item) => {
            const id = this.params.getId(item);
            itemsMap.set(id, item);
        });

        const byParentId = newByParentId.size ? new Map(this.byParentId) : this.byParentId;
        for (const [parentId, childrenIds] of newByParentId) {
            byParentId.set(parentId, childrenIds);
        }

        const nodeInfoById = newNodeInfoById.size ? new Map(this.nodeInfoById) : this.nodeInfoById;
        for (const [id, nodeInfo] of newNodeInfoById) {
            nodeInfoById.set(id, nodeInfo);
        }

        if (itemsMap === this.itemsMap && byParentId === this.byParentId && nodeInfoById === this.nodeInfoById) {
            return this;
        }

        return new Tree(this.params, itemsMap, byParentId, nodeInfoById);
    }
}
