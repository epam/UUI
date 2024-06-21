import { DropPosition, IImmutableMap, IMap, ITree, getOrderBetween, newMap } from '@epam/uui-core';
import { Task } from './types';
import { scheduleTasks as runScheduling, Task as SchedulingTask } from './scheduleTasks';
import { msPerDay } from '@epam/uui-timeline';
import { uuiDayjs, Dayjs } from '../../../helpers';

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

/**
 * 1. Group by assingees
 * 2. Feed tasks to the algorithm
 * 3. Set new actualStartDate/endDate to the tasks
 * 4. Collect min/max of actualStartDate/endDate of subtasks by task.
 * 5. Do the same for each level.
 */
export const groupByAssigneesAndIndex = (tasks: Task[]) => {
    return tasks.reduce<{ group: Record<number, Task[]>, indexById: IMap<number, number> }>(({ group, indexById }, task, index) => {
        indexById.set(task.id, index);
        if (task.type !== 'task') {
            return { group, indexById };
        }

        if (task.assignee === undefined) {
            return { group, indexById };
        }

        if (!group[task.assignee]) {
            group[task.assignee] = [];
        }

        group[task.assignee].push(task);

        return { group, indexById };
    }, { group: {}, indexById: newMap({}) });
};

export const scheduleTasks = (tasks: Task[]) => {
    const { group, indexById } = groupByAssigneesAndIndex(tasks);

    const getTask = (t: Task): SchedulingTask<number> => ({
        id: t.id,
        duration: t.estimate * msPerDay,
        startTime: new Date(t.startDate).getTime(),
    });

    const scheduled = [...tasks];
    for (const assigneesTasks of Object.values(group)) {
        const scheduledAssigneesTasks = runScheduling(assigneesTasks.map(getTask));

        for (const assingeeTasks of scheduledAssigneesTasks) {
            for (const sTask of assingeeTasks) {
                const taskIndex = indexById.get(sTask.id);
                const taskToSchedule = scheduled[taskIndex];
                const exactStartDate = uuiDayjs.dayjs(sTask.exactStartTime ?? sTask.startTime);
                scheduled[taskIndex] = { ...taskToSchedule, startDate: uuiDayjs.dayjs(exactStartDate).format('YYYY-MM-DD') };
            }
        }
    }

    return scheduled;
};
