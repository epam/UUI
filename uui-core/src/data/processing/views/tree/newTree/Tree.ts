import { DataRowPathItem } from '../../../../../types';
import { ITree } from './ITree';
import { FULLY_LOADED, NOT_FOUND_RECORD } from './constants';

export class Tree {
    public static getParents<TItem, TId>(id: TId, tree: ITree<TItem, TId>) {
        const parentIds: TId[] = [];
        let parentId = id;
        while (true) {
            const item = tree.getById(parentId);
            if (item === NOT_FOUND_RECORD) {
                break;
            }
            parentId = tree.params.getParentId?.(item);
            if (parentId === undefined) {
                break;
            }
            parentIds.unshift(parentId);
        }
        return parentIds;
    }

    public static getPathById<TItem, TId>(id: TId, tree: ITree<TItem, TId>): DataRowPathItem<TId, TItem>[] {
        const foundParents = this.getParents(id, tree);
        const path: DataRowPathItem<TId, TItem>[] = [];
        foundParents.forEach((parentId) => {
            const parent = tree.getById(parentId);
            if (parent === NOT_FOUND_RECORD) {
                return;
            }
            const pathItem: DataRowPathItem<TId, TItem> = this.getPathItem(parent, tree);
            path.push(pathItem);
        });
        return path;
    }

    public static getPathItem<TItem, TId>(item: TItem, tree: ITree<TItem, TId>): DataRowPathItem<TId, TItem> {
        const parentId = tree.params.getParentId?.(item);
        const id = tree.params.getId?.(item);

        const { ids, count, status } = tree.getItems(parentId);
        const lastId = ids[ids.length - 1];

        const isLastChild = lastId !== undefined
            && lastId === id
            && status === FULLY_LOADED
            && count === ids.length;

        return {
            id: tree.params.getId(item),
            value: item,
            isLastChild,
        };
    }

    public static forEach<TItem, TId>(
        tree: ITree<TItem, TId>,
        action: (item: TItem, id: TId, parentId: TId, stop: () => void) => void,
        options?: {
            direction?: 'bottom-up' | 'top-down';
            parentId?: TId;
            includeParent?: boolean;
        },
    ) {
        let shouldStop = false;
        const stop = () => {
            shouldStop = true;
        };

        options = { direction: 'top-down', parentId: undefined, ...options };
        if (options.includeParent == null) {
            options.includeParent = options.parentId != null;
        }

        const iterateNodes = (ids: TId[]) => {
            if (shouldStop) return;
            ids.forEach((id) => {
                if (shouldStop) return;
                const item = tree.getById(id);
                const parentId = item !== NOT_FOUND_RECORD ? tree.params.getParentId?.(item) : undefined;
                walkChildrenRec(item === NOT_FOUND_RECORD ? undefined : item, id, parentId);
            });
        };

        const walkChildrenRec = (item: TItem, id: TId, parentId: TId) => {
            if (options.direction === 'top-down') {
                action(item, id, parentId, stop);
            }
            const { ids: childrenIds } = tree.getItems(id);
            childrenIds && iterateNodes(childrenIds);
            if (options.direction === 'bottom-up') {
                action(item, id, parentId, stop);
            }
        };

        if (options.includeParent) {
            iterateNodes([options.parentId]);
        } else {
            iterateNodes(tree.getItems(options.parentId).ids);
        }
    }

    public static forEachChildren<TItem, TId>(
        tree: ITree<TItem, TId>,
        action: (id: TId) => void,
        isSelectable: (item: TItem) => boolean,
        parentId?: TId,
        includeParent: boolean = true,
    ) {
        this.forEach(
            tree,
            (item, id) => {
                if (item && isSelectable(item)) {
                    action(id);
                }
            },
            { parentId: parentId, includeParent },
        );
    }
}
