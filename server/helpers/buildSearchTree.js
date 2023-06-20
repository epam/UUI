function getParents(item, fullTree, prevParents = []) {
    if (item.parentId === null || item.parentId === undefined) {
        return prevParents;
    }

    const parent = fullTree.byId.get(item.parentId);
    return getParents(parent, fullTree, [fullTree.byId.get(item.parentId), ...prevParents]);
}

function buildChildren(id, byParentId) {
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

function buildSearchTree(foundItems, fullTree) {
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
                byId.set(parent.id, fullTree.byId.get(parent));
            });
            return;
        }

        const children = byParentId.get(item.parentId);
        if (!contains(item, children)) {
            children.push(item);
        }
    });

    return buildChildren(null, byParentId);
}

module.exports = {
    buildSearchTree,
};
