import { LocationItem } from './types';

interface LocationsTree<TItem, TId> {
    byId: Map<TId, TItem>;
    byParentId: Map<TId, TId[]>;
    list: TItem[];
}

function getParents(item: LocationItem, fullTree: LocationsTree<LocationItem, LocationItem['id']>, prevParents: LocationItem[] = []) {
    if (item.parentId === null || item.parentId === undefined) {
        return prevParents;
    }

    const parent = fullTree.byId.get(item.parentId);
    if (!parent) {
        return prevParents;
    }

    return getParents(parent, fullTree, [parent, ...prevParents]);
}

export function buildChildren(id, byParentId) {
    const children = byParentId.get(id);
    if (!children) {
        return null;
    }

    return children.map((child) => ({
        children: buildChildren(child.id, byParentId),
        ...child,
        childCount: byParentId.get(child.id)?.length ?? 0,
    }));
}

function contains(item, children) {
    return children.some(({ id }) => id === item.id);
}

export function buildSearchTree(foundItems: LocationItem[], allItems: LocationItem[]): LocationItem[] {
    const allById = new Map(allItems.map((l) => [l.id, l]));
    const allByParentId = new Map();

    allItems.forEach((l) => {
        if (allByParentId.get(l.parentId) == null) {
            allByParentId.set(l.parentId, []);
        }
        allByParentId.get(l.parentId).push(l);
    });
    const fullTree = { byId: allById, byParentId: allByParentId, list: allItems };

    const byId = new Map(foundItems.map((l) => [l.id, l]));
    const byParentId = new Map();

    foundItems.forEach((item) => {
        if (!byParentId.has(item.parentId)) {
            byParentId.set(item.parentId, [item]);

            const parents = getParents(item, fullTree);
            parents.forEach((parent) => {
                if (!byParentId.has(parent.parentId)) {
                    byParentId.set(parent.parentId, []);
                }
                const children = byParentId.get(parent.parentId);
                if (!contains(parent, children)) {
                    children.push(parent);
                }
                byId.set(parent.id, parent);
            });
            return;
        }

        const children = byParentId.get(item.parentId);
        if (!contains(item, children)) {
            children.push(item);
        }
    });

    return buildChildren(null, byParentId) || [];
}
