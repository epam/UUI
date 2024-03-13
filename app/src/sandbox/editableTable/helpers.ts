import { ItemsMap } from '@epam/uui-core';
import { Task } from './types';

const findAllChildren = (tasks: ItemsMap<number, Task>, parentTask: Task) => {
    const children: Task[] = [];
    tasks.forEach((task) => {
        if (task.parentId === parentTask.id) {
            children.push(task);
        }
    });
    let ids: number[] = [];
    children.forEach((task) => {
        ids.push(task.id);
        const innerChildren = findAllChildren(tasks, task);
        ids = ids.concat(innerChildren);
    });
    return ids;
};

export const deleteTaskWithChildren = (tasks: ItemsMap<number, Task>, taskToDelete: Task | null): ItemsMap<number, Task> => {
    let taskToBeDeleted = taskToDelete;
    if (taskToBeDeleted === undefined) {
        tasks.forEach((task) => {
            if (task.parentId === undefined) {
                taskToBeDeleted = task;
            }
        });
    }

    if (!taskToBeDeleted) {
        return tasks;
    }

    const childrenIds = findAllChildren(tasks, taskToBeDeleted);
    let newItemsMap = tasks;

    [taskToBeDeleted.id, ...childrenIds].forEach((id) => {
        newItemsMap = newItemsMap.set(id);
    });

    return newItemsMap;
};
