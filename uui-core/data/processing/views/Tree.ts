export interface TreeNode<TItem, TId> {
    id: TId;
    key: string;
    item: TItem;
    parentId: TId;
    originalIndex: number;
}

export interface TreeParams<TItem, TId> {
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
}

export class Tree<TItem, TId> {
    private constructor(
        private params: TreeParams<TItem, TId>,
        private readonly byId: Map<TId, TreeNode<TItem, TId>>,
        private readonly byParentId: Map<TId, TreeNode<TItem, TId>[]>,
    ) {
    }

    public static blank<TItem, TId>(params: TreeParams<TItem, TId>) {
        return new Tree<TItem, TId>(
            params,
            new Map<TId, TreeNode<TItem, TId>>(),
            new Map<TId, TreeNode<TItem, TId>[]>(),
        );
    }

    public static create<TItem, TId>(params: TreeParams<TItem, TId>, items: TItem[] | Tree<TItem, TId>): Tree<TItem, TId> {
        if (items instanceof Tree) {
            return items;
        } else {
            // TBD: restore this optimization if needed. TBD: compare node index to detect when items are moved without changing
            // const isItemsEqual = (this.props.items.length === this.tree.getTotalRecursiveCount())
            //     && this.props.items.every((value, index) => value === this.tree.getById(this.props.getId(value)));

            return Tree.blank(params).append(items);
        }
    }

    public getRootNodes() {
        // For historical reasons, both null and undefined can serve as root ID. We use undefined internally.
        // This opens a way to make null a legal ID, which is usable in certain cases.
        return this.byParentId.get(undefined) || [];
    }

    public getById(id: TId) {
        const node = this.byId.get(id);
        if (node) {
            return node.item;
        } else {
            return undefined;
        }
    }

    public getNodeById(id: TId) {
        return this.byId.get(id);
    }

    public getNodesByParentId(parentId: TId) {
        return this.byParentId.get(parentId ?? undefined) || [];
    }

    public getChildrenNodes(node: TreeNode<TItem, TId>) {
        return this.byParentId.get(node.id) || [];
    }

    public getTotalRecursiveCount() {
        return this.byId.size;
    }

    public getParents(id: TId) {
        const parents: TreeNode<TItem, TId>[] = [];
        let node = this.getNodeById(id);
        while (true) {
            node = this.getNodeById(node.parentId);
            if (!node) {
                break;
            }
            parents.unshift(node);
        };
        return parents;
    }

    public forEachChildrenRecursively(id: TId, action: (node: TreeNode<TItem, TId>) => void) {
        const walkChildrenRec = (node: TreeNode<TItem, TId>) => {
            action(node);
            const children = this.getChildrenNodes(node);
            children && children.forEach(walkChildrenRec);
        };

        const node = this.getNodeById(id);
        walkChildrenRec(node);
    }

    public isFlatList() {
        return this.byParentId.size <= 1;
    }

    public append(itemsToAdd: TItem[]) {
        if (!itemsToAdd || itemsToAdd.length === 0) {
            return this;
        }

        const newById = new Map(this.byId);
        const newByParentId = new Map(this.byParentId); // shallow clone, still need to copy arrays inside!

        itemsToAdd.forEach((item, itemIndex) => {
            const id = this.params.getId(item);
            const existingNode = this.getNodeById(id);
            if (!existingNode || existingNode.item !== item) {
                const id = this.params.getId(item);
                const node: TreeNode<TItem, TId> = {
                    id,
                    key: JSON.stringify(id),
                    originalIndex: itemIndex,
                    parentId: this.params.getParentId && this.params.getParentId(item),
                    item: item,
                }
                newById.set(id, node);

                const parentId = this.params.getParentId ? (this.params.getParentId(item) ?? undefined) : undefined;

                if (!existingNode || existingNode.parentId != node.parentId) {
                    node.parentId = parentId;

                    let list = newByParentId.get(parentId);
                    if (!list) {
                        list = [];
                        newByParentId.set(parentId, list);
                    } else if (list === this.byParentId.get(parentId)) { // need to create shallow copy
                        list = [...list];
                    }
                    list.push(node);

                    // TBD: remove item from existing list (if we'll use this method to mutate existing list)
                }
            }
        });

        return new Tree(
            this.params,
            newById,
            newByParentId,
        );
    }
}