import { items } from "app/src/documents/structure";
import { bindKey } from "lodash";

export interface TreeNode<TItem, TId> {
    id: TId;
    key: string;
    item: TItem;
    parentId: TId;
    index: number;
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

    public getItemsByParentId(parentId: TId) {
        return this.getNodesByParentId(parentId).map(i => i.item);
    }

    public getTotalRecursiveCount() {
        return this.byId.size;
    }

    public getParentNodesRecursive(id: TId) {
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

    /** Returns all nodes which has children.
     * The list is sorted topologically, so top-level nodes are returned first.
     */
    // public getAllParentNodes(): TreeNode<TItem, TId>[] {
    //     const parentIds = Array.from(this.byParentId.keys());
    //     const parents = parentIds.map(id => this.byId.get(id)).filter(i => i !== undefined);
    //     return parents;
    // }

    public forEach(
        action: (node: TreeNode<TItem, TId>) => void,
        options?: {
            parentId?: TId,
            direction?: 'bottom-up' | 'top-down',
            includeRoot?: boolean,
        }
    ) {
        options = { direction: 'top-down', includeRoot: false, ...options };
        const walkChildrenRec = (node: TreeNode<TItem, TId>) => {
            if (options.direction === 'top-down' && node) {
                action(node);
            }
            const children = this.getNodesByParentId(node ? node.id : undefined);
            children && children.forEach(walkChildrenRec);
            if (options.direction === 'bottom-up' && node) {
                action(node);
            }
        };

        const node = this.byId.get(options.parentId);
        walkChildrenRec(node);
    }

    public computeSubtotals<TSubtotals>(
        get: (item: TItem, hasChildren: boolean) => TSubtotals,
        add: (a: TSubtotals, b: TSubtotals) => TSubtotals,
    ) {
        const subtotalsMap = new Map<TId | undefined, TSubtotals>();

        this.forEach(node => {
            let itemSubtotals = get(node.item, this.byParentId.has(node.id));

            // add already computed children subtotals
            if (subtotalsMap.has(node.id)) {
                itemSubtotals = add(itemSubtotals, subtotalsMap.get(node.id));
            }

            // store
            subtotalsMap.set(node.id, itemSubtotals);

            // add value to parent
            let parentSubtotals: TSubtotals;
            if (!subtotalsMap.has(node.parentId)) {
                parentSubtotals = itemSubtotals;
            } else {
                parentSubtotals = add(itemSubtotals, subtotalsMap.get(node.parentId));
            }
            subtotalsMap.set(node.parentId, parentSubtotals);
        }, { direction: 'bottom-up' })
        return subtotalsMap;
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

        itemsToAdd.forEach((item) => {
            const id = this.params.getId(item);
            const existingNode = this.getNodeById(id);
            if (!existingNode || existingNode.item !== item) {
                const id = this.params.getId(item);
                const node: TreeNode<TItem, TId> = {
                    id,
                    key: JSON.stringify(id),
                    index: 0, // set later, when inserting to the parent
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
                        newByParentId.set(parentId, list);
                    }
                    list.push(node);
                    node.index = list.length - 1;

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