export interface TreeParams<TItem, TId> {
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
}

export class Tree<TItem, TId> {
    private getId: (item: TItem) => TId;
    private getParentId: (item: TItem) => TId;

    private constructor(
        private params: TreeParams<TItem, TId>,
        private readonly byId: Map<TId, TItem>,
        private readonly byParentId: Map<TId, TId[]>,
    ) {
        this.getId = params.getId;
        this.getParentId = params.getParentId
            ? ((item: TItem) => (params.getParentId(item) ?? undefined))
            : () => undefined;
    }

    public static blank<TItem, TId>(params: TreeParams<TItem, TId>) {
        return new Tree<TItem, TId>(
            params,
            new Map<TId, TItem>(),
            new Map<TId, TId[]>([[undefined, []]]), // add empty children list for root to avoid corner-cases
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

    public getRootIds() {
        return this.byParentId.get(undefined);
    }

    public getRootItems() {
        return this.byParentId.get(undefined).map(id => this.byId.get(id)!);
    }

    public getById(id: TId) {
        return this.byId.get(id);
    }

    public getChildren(item: TItem) {
        const id = this.getId(item);
        return this.getChildrenByParentId(id);
    }

    public getChildrenByParentId(parentId: TId) {
        const ids = this.getChildrenIdsByParentId(parentId);
        const children = ids.map(id => this.byId.get(id));
        return children;
    }

    public getChildrenIdsByParentId(parentId: TId) {
        return this.byParentId.get(parentId) || [];
    }

    public getTotalRecursiveCount() {
        return this.byId.size;
    }

    public getParentIdsRecursive(id: TId) {
        const parentIds: TId[] = [];
        while (true) {
            let item = this.byId.get(id);
            if (!item) {
                break;
            }
            id = this.getParentId(item)
            if (!id) {
                break;
            }
            parentIds.unshift(id);
        };
        return parentIds;
    }

    public forEach(
        action: (item: TItem, id: TId, parentId: TId) => void,
        options?: {
            direction?: 'bottom-up' | 'top-down',
            parentId?: TId,
            includeParent?: boolean,
        }
    ) {
        options = { direction: 'top-down', includeParent: true, parentId: undefined, ...options };

        const iterateNodes = (ids: TId[]) => {
            ids.forEach(id => {
                const item = this.byId.get(id);
                const parentId = item ? this.getParentId(item) : undefined;
                walkChildrenRec(item, id, parentId);
            });
        }

        const walkChildrenRec = (item: TItem, id: TId, parentId: TId) => {
            if (options.direction === 'top-down') {
                action(item, id, parentId);
            }
            const childrenIds = this.byParentId.get(id);
            childrenIds && iterateNodes(childrenIds);
            if (options.direction === 'bottom-up') {
                action(item, id, parentId);
            }
        };

        if (options.parentId != null && options.includeParent) {
            iterateNodes([options.parentId]);
        } else {
            iterateNodes(this.byParentId.get(options.parentId));
        }
    }

    public computeSubtotals<TSubtotals>(
        get: (item: TItem, hasChildren: boolean) => TSubtotals,
        add: (a: TSubtotals, b: TSubtotals) => TSubtotals,
    ) {
        const subtotalsMap = new Map<TId | undefined, TSubtotals>();

        this.forEach((item, id, parentId) => {
            let itemSubtotals = get(item, this.byParentId.has(id));

            // add already computed children subtotals
            if (subtotalsMap.has(id)) {
                itemSubtotals = add(itemSubtotals, subtotalsMap.get(id));
            }

            // store
            subtotalsMap.set(id, itemSubtotals);

            // add value to parent
            let parentSubtotals: TSubtotals;
            if (!subtotalsMap.has(parentId)) {
                parentSubtotals = itemSubtotals;
            } else {
                parentSubtotals = add(itemSubtotals, subtotalsMap.get(parentId));
            }
            subtotalsMap.set(parentId, parentSubtotals);
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
            const id = this.getId(item);
            const existingItem = this.byId.get(id);
            if (!existingItem || existingItem !== item) {
                const id = this.getId(item);
                newById.set(id, item);

                const parentId = this.getParentId(item);
                const existingItemParentId = existingItem ? this.getParentId(existingItem) : undefined;

                if (!existingItem || parentId != existingItemParentId) {
                    let list = newByParentId.get(parentId);
                    if (!list) {
                        list = [];
                        newByParentId.set(parentId, list);
                    } else if (list === this.byParentId.get(parentId)) { // need to create shallow copy
                        list = [...list];
                        newByParentId.set(parentId, list);
                    }
                    list.push(id);

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