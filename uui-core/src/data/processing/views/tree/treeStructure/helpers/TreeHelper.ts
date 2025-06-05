import type { ITree } from '../../ITree';
import { NOT_FOUND_RECORD } from '../../constants';

export class TreeHelper {
    public static getParents<TItem, TId>(id: TId, tree: ITree<TItem, TId>) {
        const parentIds: TId[] = [];
        let parentId = id;
        while (true) {
            const item = tree.getById(parentId);
            if (item === NOT_FOUND_RECORD) {
                break;
            }
            parentId = tree.getParams().getParentId?.(item);
            if (parentId === undefined) {
                break;
            }
            parentIds.unshift(parentId);
        }
        return parentIds;
    }
}
