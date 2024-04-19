import { IImmutableMap, ITree } from '@epam/uui-core';
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
