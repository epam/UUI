import { ITree, NOT_FOUND_RECORD,
    TreeNodeInfo, TreeParams, ItemsInfo, TreeNodeStatus, IMap } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export class Tree implements ITree<Location, string> {
    constructor(
        protected _params: TreeParams<Location, string>,
        protected _itemsMap: IMap<string, Location> = new Map(),
        protected _byParentId: IMap<string, string[]> = new Map(),
        protected _nodeInfoById: IMap<string, TreeNodeInfo> = new Map(),
    ) {}

    public getParams() {
        return this._params;
    }

    public getItems(parentId?: string): ItemsInfo<string> {
        const ids = this._byParentId.get(parentId) ?? [];
        const { count, totalCount } = this._nodeInfoById.get(parentId) ?? {};

        let status: TreeNodeStatus = count === undefined ? 'PARTIALLY_LOADED' : 'EMPTY';
        if (count !== 0 && ids.length === count) {
            status = 'FULLY_LOADED';
        }
        const parent = this._itemsMap.get(parentId);
        let assumedCountInfo: { assumedCount?: number } = {};
        if (parent && 'childCount' in parent) {
            assumedCountInfo = { assumedCount: parent.childCount };
        }
        return { ids, count, totalCount, status, ...assumedCountInfo };
    }

    getById(id: string): Location | typeof NOT_FOUND_RECORD {
        return this.itemsMap.has(id) ? this.itemsMap.get(id) : NOT_FOUND_RECORD;
    }

    public static blank(params: TreeParams<Location, string>, itemsMap?: IMap<string, Location>) {
        return new Tree(params, itemsMap);
    }

    public get itemsMap() {
        return this._itemsMap;
    }

    public update(items: Location[], newByParentId: IMap<string, string[]>, newNodeInfoById: IMap<string, TreeNodeInfo>) {
        items.forEach((item) => {
            const id = this.getParams().getId(item);
            this._itemsMap.set(id, item);
        });

        const byParentId = newByParentId.size ? new Map(this._byParentId) : this._byParentId;
        for (const [parentId, childrenIds] of newByParentId) {
            byParentId.set(parentId, childrenIds);
        }

        const nodeInfoById = newNodeInfoById.size ? new Map(this._nodeInfoById) : this._nodeInfoById;
        for (const [id, nodeInfo] of newNodeInfoById) {
            nodeInfoById.set(id, nodeInfo);
        }

        if (!items.length && byParentId === this._byParentId && nodeInfoById === this._nodeInfoById) {
            return this;
        }

        return new Tree(this.getParams(), this._itemsMap, byParentId, nodeInfoById);
    }
}
