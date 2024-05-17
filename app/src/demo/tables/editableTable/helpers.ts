import { DropPosition, IImmutableMap, ITree, getOrderBetween } from '@epam/uui-core';
import { Task } from './types';

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
        currentTasks = currentTasks.set(id, { ...tree.getById(id) as Task, isDeleted: true });
    });

    return currentTasks;
};

export const setTaskInsertPosition = (taskToInsert: Task, relativeTask: Task | null = null, position: DropPosition, tree: ITree<Task, number>) => {
    const task = { ...taskToInsert };
    let currentPosition: DropPosition = position;
    let currentRelativeTask: Task | null = relativeTask;
    if (currentPosition === 'inside') {
        task.parentId = currentRelativeTask.id;
        currentPosition = 'top' as DropPosition;
        currentRelativeTask = null;
    } else if (currentRelativeTask) {
        task.parentId = currentRelativeTask.parentId;
    }

    const { ids: currentListIds } = tree.getItems(task.parentId);
    const getOrderByIndex = (index: number) => {
        const id = currentListIds[index];
        const item = tree.getById(id) as Task;

        return item.order;
    };

    let relativeToIndex: number = currentPosition === 'top' ? 0 : currentListIds.length - 1;
    if (currentRelativeTask) {
        relativeToIndex = currentListIds.indexOf(currentRelativeTask.id);
    }

    const indexAbove = currentPosition === 'top' ? relativeToIndex - 1 : relativeToIndex;
    const indexBelow = currentPosition === 'bottom' ? relativeToIndex + 1 : relativeToIndex;
    const orderAbove = indexAbove >= 0 ? getOrderByIndex(indexAbove) : null;
    const orderBelow = indexBelow < currentListIds.length ? getOrderByIndex(indexBelow) : null;

    task.order = getOrderBetween(orderAbove, orderBelow);
    return task;
};
