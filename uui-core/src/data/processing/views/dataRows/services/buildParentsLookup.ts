import { ITree, NOT_FOUND_RECORD, Tree } from '../../tree';

export const idToKey = <TId>(id: TId) => typeof id === 'object' ? JSON.stringify(id) : `${id}`;

export const buildParentsLookup = <TItem, TId>(ids: TId[], tree: ITree<TItem, TId>, getParentId?: (item: TItem) => TId) => {
    const idsByKey: Record<string, boolean> = {};
    const someChildInIdsByKey: Record<string, boolean> = {};
    const checkedItems = ids ?? [];
    for (let i = checkedItems.length - 1; i >= 0; i--) {
        const id = checkedItems[i];
        idsByKey[idToKey(id)] = true;
        if (!tree || !getParentId) {
            continue;
        }

        const item = tree.getById(id);
        if (item === NOT_FOUND_RECORD) {
            continue;
        }

        const parentId = getParentId(item);
        if (!someChildInIdsByKey[idToKey(parentId)]) {
            const parents = Tree.getParents(id, tree).reverse();
            for (const parent of parents) {
                if (someChildInIdsByKey[idToKey(parent)]) {
                    break;
                }
                someChildInIdsByKey[idToKey(parent)] = true;
            }
        }
    }
    return { idsByKey, someChildInIdsByKey };
};
