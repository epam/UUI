export function buildSearchTree(foundItems: any, fullTree: any): any {
    function getParents(item: any, tree: any, prevParents: any[] = []): any[] {
        if (item.parentId === null || item.parentId === undefined) {
            return prevParents;
        }
        const parent = tree.byId.get(item.parentId);
        return getParents(parent, tree, [tree.byId.get(item.parentId), ...prevParents]);
    }
    function buildChildren(id: any, byParentId: any): any {
        const children = byParentId.get(id);
        if (!children) {
            return null;
        }
        return children.map((child: any) => ({
            children: buildChildren(child.id, byParentId),
            ...child,
            childCount: byParentId.get(child.id)?.length ?? 0,
        }));
    }
    function contains(item: any, children: any[]): boolean {
        return children.some(({ id }) => id === item.id);
    }
    const byId = new Map(foundItems.map((l: any) => [l.id, l]));
    const byParentId = new Map();
    foundItems.forEach((item: any) => {
        if (!byParentId.has(item.parentId)) {
            byParentId.set(item.parentId, [item]);
            const parents = getParents(item, fullTree);
            parents.forEach((parent: any) => {
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
