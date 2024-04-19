import { IImmutableMap, ITree, getOrderBetween, maxOrderStr, minOrderStr } from '@epam/uui-core';
import { Task } from './types';

/**
 * Finds a string, which is placed alphabetically in desired position of the list.
 * If relativeTo is not specified, it is assumed that you need 'before' the first or 'after' the last item
 * If relativeTo is specified, location is before/after the relativeTo string.
 *  @see getOrderString function for details about order strings.
 */
export function getInsertionOrder(existingOrders: string[], position: 'before' | 'after', relativeTo?: string) {
    if (!relativeTo) {
        if (position === 'before') {
            // inserting at the top of the list, is the same as inserting after the minOrder
            relativeTo = minOrderStr;
            position = 'after';
        } else if (position === 'after') {
            // inserting at the bottom of the list, is the same as inserting before the maxOrder
            relativeTo = maxOrderStr;
            position = 'before';
        }
    }

    if (position === 'before') {
        let maxOrder = minOrderStr;
        existingOrders.forEach((order) => {
            if (order < relativeTo && order > maxOrder) {
                maxOrder = order;
            }
        });
        return getOrderBetween(maxOrder, relativeTo);
    } else {
        let minOrder = maxOrderStr;
        existingOrders.forEach((order) => {
            if (order > relativeTo && order < minOrder) {
                minOrder = order;
            }
        });
        return getOrderBetween(relativeTo, minOrder);
    }
}

const findAllChildren = (tree: ITree<Task, number>, parentTaskId: number) => {
    const { ids: children } = tree.getItems(parentTaskId);

    let ids: number[] = [];
    children.forEach((id) => {
        ids.push(id);
        const innerChildren = findAllChildren(tree, id);
        ids = ids.concat(innerChildren);
    });
    return ids;
};

export const deleteTaskWithChildren = (taskToDelete: Task | null, tasks: IImmutableMap<number, Task>, tree: ITree<Task, number>): IImmutableMap<number, Task> => {
    let taskToBeDeleted = taskToDelete;
    if (taskToBeDeleted === undefined) {
        const { ids: rootItemsIds } = tree.getItems(undefined);
        const lastRootTaskId = rootItemsIds[rootItemsIds.length - 1];
        if (lastRootTaskId === undefined) {
            return tasks;
        }
        taskToBeDeleted = tasks.get(lastRootTaskId);
    }

    let currentTasks = tasks;
    const childrenIds = findAllChildren(tree, taskToBeDeleted.id);
    [taskToBeDeleted.id, ...childrenIds].forEach((id) => {
        currentTasks = currentTasks.set(id, { ...currentTasks.get(id), isDeleted: true });
    });

    return currentTasks;
};
