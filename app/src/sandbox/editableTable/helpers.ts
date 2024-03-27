import { ITree, NOT_FOUND_RECORD, getOrderBetween, numberToOrder } from '@epam/uui-core';

const shift = 10;

const getItemOrder = <TItem, TId>(
    id: TId,
    tree: ITree<TItem, TId>,
    treeWithoutPatch: ITree<TItem, TId>,
    getTemporaryOrder: (item: TItem) => string,
) => {
    const item = tree.getById(id);
    if (item === NOT_FOUND_RECORD) {
        throw Error(`Unknown id = ${id}`);
    }
    const parentId = tree.getParams().getParentId?.(item) ?? undefined;

    const order = getTemporaryOrder?.(item);
    if (order) {
        return order;
    }
    const { ids: originalIds } = treeWithoutPatch.getItems(parentId);
    const itemIndex = originalIds.findIndex((originalId) => id === originalId);
    return itemIndex === -1 ? numberToOrder(shift) : numberToOrder(itemIndex + shift + 1);
};

export function getTopTemporaryOrder<TItem, TId>(
    parentId: TId,
    tree: ITree<TItem, TId>,
    treeWithoutPatch: ITree<TItem, TId>,
    getTemporaryOrder: (item: TItem) => string,
) {
    const { ids } = tree.getItems(parentId);
    const [first] = ids;

    if (first === undefined) {
        return getOrderBetween(numberToOrder(shift), numberToOrder(shift + 1));
    }

    const firstItem = tree.getById(first);
    if (firstItem === NOT_FOUND_RECORD) {
        return getOrderBetween(numberToOrder(shift), numberToOrder(shift + 1));
    }

    const firstItemOrder = getItemOrder(first, tree, treeWithoutPatch, getTemporaryOrder);
    return getOrderBetween(numberToOrder(shift), firstItemOrder);
}

export function getBottomTemporaryOrder<TItem, TId>(
    parentId: TId,
    tree: ITree<TItem, TId>,
    treeWithoutPatch: ITree<TItem, TId>,
    getTemporaryOrder: (item: TItem) => string,
) {
    const { ids } = tree.getItems(parentId);
    const last = ids[ids.length - 1];

    if (last === undefined) {
        return getOrderBetween(numberToOrder(36), null);
    }

    const lastItem = tree.getById(last);
    if (lastItem === NOT_FOUND_RECORD) {
        return getOrderBetween(numberToOrder(36), null);
    }

    const lastItemOrder = getItemOrder(last, tree, treeWithoutPatch, getTemporaryOrder);
    return getOrderBetween(lastItemOrder, null);
}

export function getAfterItemTemporaryOrder<TItem, TId>(
    afterId: TId,
    tree: ITree<TItem, TId>,
    treeWithoutPatch: ITree<TItem, TId>,
    getTemporaryOrder: (item: TItem) => string,
) {
    const item = tree.getById(afterId);
    if (item === NOT_FOUND_RECORD) {
        throw Error(`Unknown id = ${afterId}`);
    }

    const parentId = tree.getParams().getParentId?.(item) ?? undefined;

    const { ids } = tree.getItems(parentId);
    const afterIndex = ids.findIndex((id) => id === afterId);
    const afterItemOrder = getItemOrder(afterId, tree, treeWithoutPatch, getTemporaryOrder);
    if (afterIndex === ids.length - 1) {
        return getOrderBetween(afterItemOrder, null);
    }

    const nextId = ids[afterIndex + 1];
    const nextItemOrder = getItemOrder(nextId, tree, treeWithoutPatch, getTemporaryOrder);

    return getOrderBetween(afterItemOrder, nextItemOrder);
}

export function getBeforeItemTemporaryOrder<TItem, TId>(
    beforeId: TId,
    tree: ITree<TItem, TId>,
    treeWithoutPatch: ITree<TItem, TId>,
    getTemporaryOrder: (item: TItem) => string,
) {
    const item = tree.getById(beforeId);
    if (item === NOT_FOUND_RECORD) {
        throw Error(`Unknown id = ${beforeId}`);
    }

    const parentId = tree.getParams().getParentId?.(item) ?? undefined;

    const { ids } = tree.getItems(parentId);
    const beforeIndex = ids.findIndex((id) => id === beforeId);
    const beforeItemOrder = getItemOrder(beforeId, tree, treeWithoutPatch, getTemporaryOrder);

    if (beforeIndex === 0) {
        return getOrderBetween(numberToOrder(shift), beforeItemOrder);
    }

    const previousId = ids[beforeIndex - 1];
    const previousItemOrder = getItemOrder?.(previousId, tree, treeWithoutPatch, getTemporaryOrder);
    return getOrderBetween(previousItemOrder, beforeItemOrder);
}
