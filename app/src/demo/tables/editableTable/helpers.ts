import { DropPosition, IImmutableMap, IMap, ITree, Tree, getOrderBetween, newMap } from '@epam/uui-core';
import { Task } from './types';
import { scheduleTasks as runScheduling, Task as SchedulingTask } from './scheduleTasks';
import { msPerDay } from '@epam/uui-timeline';
import { Dayjs, uuiDayjs } from '../../../helpers';

function compareScalars(a: any, b: any, order: number) {
    if (a == null) {
        if (b == null) {
            return 0;
        }
        return -order;
    }
    if (b == null) return order;
    if (a < b) return -order;
    if (a === b) return 0;

    return order;
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

const formatDate = (date: string | number | Dayjs | Date) => uuiDayjs.dayjs(date).format('YYYY-MM-DD');

/**
 * 1. Group by assingees
 * 2. Feed tasks to the algorithm
 * 3. Set new actualStartDate/endDate to the tasks
 * 4. Collect min/max of actualStartDate/endDate of subtasks by task.
 * 5. Do the same for each level.
 */
export const groupByAssigneesAndIndex = (tasks: Task[]) => {
    return tasks.reduce<Record<number, Task[]>>((group, task) => {
        if (task.type !== 'task') {
            return group;
        }

        if (task.assignee === undefined) {
            return group;
        }

        if (!group[task.assignee]) {
            group[task.assignee] = [];
        }

        group[task.assignee].push(task);

        return group;
    }, []);
};

const getOrderedTasks = (tree: ITree<Task, number>, updatedValues: IImmutableMap<number, Task>) => {
    const tasks: Task[][] = [];

    let lastStoryTasks: Task[] = [];
    const startDates: IMap<number, number> = newMap({});

    Tree.forEach(tree, (task, id, parentId) => {
        const currentTask = updatedValues.get(id) ?? task;
        const parentStartDate = startDates.get(currentTask.parentId);
        startDates.set(id, currentTask.startDate ? Math.max(new Date(currentTask.startDate).getTime(), parentStartDate ?? 0) : parentStartDate);

        if (currentTask.type === 'task') {
            const { ids } = tree.getItems(parentId);
            const isLastChild = ids.indexOf(currentTask.id) === ids.length - 1;

            lastStoryTasks.push({ ...currentTask, startDate: formatDate(startDates.get(id)) });
            if (isLastChild) {
                lastStoryTasks.sort((a, b) => {
                    const startDate1 = new Date(a.startDate).getTime();
                    const startDate2 = new Date(b.startDate).getTime();

                    const res = compareScalars(startDate1, startDate2, 1);
                    return res;
                });

                tasks.push(lastStoryTasks);
                lastStoryTasks = [];
            }
        }
    }, { direction: 'top-down' });

    return tasks.flat();
};

const toTime = (date: string) => uuiDayjs.dayjs(date).toDate().getTime();
const addTime = (date: string, estimate: number) => uuiDayjs.dayjs(date).add(estimate, 'day').toDate().getTime();

type Subtotals = {
    type: 'entity';
    startDate: string;
    dueDate: string;
    estimate: number;
    id: number;
    parentId: number;
    hasChildren?: boolean;
} | {
    type: 'subtotal';
    startDate: string;
    dueDate: string;
    estimate: number;
    forParentId: number;
    hasChildren?: boolean;
};

const getStartDate = (child1: Subtotals, child2: Subtotals) => {
    if (!child1.startDate) {
        return child2.startDate;
    }

    if (!child2.startDate) {
        return child1.startDate;
    }
    return formatDate(Math.min(toTime(child1.startDate), toTime(child2.startDate)));
};

const getChildDueDate = (child: Subtotals) => {
    if (!child.dueDate) {
        return child.hasChildren ? undefined : addTime(child.startDate, child.estimate);
    }
    return toTime(child.dueDate);
};

const getDueDate = (child1: Subtotals, child2: Subtotals) => {
    const child1DueDate = getChildDueDate(child1);
    const child2DueDate = getChildDueDate(child2);

    if (!child1DueDate) {
        return child2DueDate ? formatDate(child2DueDate) : undefined;
    }

    if (!child2DueDate) {
        return child1DueDate ? formatDate(child1DueDate) : undefined;
    }

    return formatDate(Math.max(child1DueDate, child2DueDate));
};

type ByType<T, Type> = T extends { type: Type } ? T : never;
const getForParentIdEntities = (child1: ByType<Subtotals, 'entity'>, child2: ByType<Subtotals, 'entity'>) => {
    if (child1.parentId === child2.parentId) {
        return child1.parentId;
    }

    if (child1.id === child2.parentId) {
        return child1.parentId;
    }

    return child2.parentId;
};

const getForParentIdEntityAndSubtotal = (child1: ByType<Subtotals, 'entity'>, child2: ByType<Subtotals, 'subtotal'>) => {
    if (child1.id === child2.forParentId) {
        return child1.parentId;
    }

    return child2.forParentId;
};

const getForParentId = (child1: Subtotals, child2: Subtotals) => {
    if (child1.type === 'entity') {
        if (child2.type === 'entity') {
            return getForParentIdEntities(child1, child2);
        }
        return getForParentIdEntityAndSubtotal(child1, child2);
    }

    if (child2.type === 'entity') {
        return getForParentIdEntityAndSubtotal(child2, child1);
    }

    return child1.forParentId;
};

const getEstimateForEntities = (child1: ByType<Subtotals, 'entity'>, child2: ByType<Subtotals, 'entity'>) => {
    if (child1.parentId === child2.parentId) {
        return (child1.estimate ?? 0) + (child2.estimate ?? 0);
    }

    if (child1.parentId === child2.id) {
        return child1.estimate ?? 0;
    }

    return child2.estimate ?? 0;
};

const getEstimateForEntityAndSubtotal = (child1: ByType<Subtotals, 'entity'>, child2: ByType<Subtotals, 'subtotal'>) => {
    if (child1.parentId === child2.forParentId) {
        return (child1.estimate ?? 0) + (child2.estimate ?? 0);
    }

    if (child1.id === child2.forParentId) {
        return child2.estimate ?? 0;
    }

    return child2.estimate;
};

const getEstimate = (child1: Subtotals, child2: Subtotals) => {
    if (child1.type === 'entity') {
        if (child2.type === 'entity') {
            return getEstimateForEntities(child1, child2);
        }

        return getEstimateForEntityAndSubtotal(child1, child2);
    }

    if (child2.type === 'entity') {
        return getEstimateForEntityAndSubtotal(child2, child1);
    }

    return child1.forParentId === child2.forParentId ? (child1.estimate + child2.estimate) : child1.estimate;
};

export const scheduleTasks = (
    patch: (updated: IImmutableMap<number, Task> | IMap<number, Task>) => ITree<Task, number>,
    updatedItemsMap: IImmutableMap<number, Task>,
) => {
    const patchedTree = patch(updatedItemsMap);
    const tasks: Task[] = getOrderedTasks(patchedTree, updatedItemsMap);

    const group = groupByAssigneesAndIndex(tasks);

    const getTask = (t: Task): SchedulingTask<number> => ({
        id: t.id,
        name: t.name,
        duration: t.estimate * msPerDay,
        startTime: new Date(t.startDate).getTime(),
        parentId: t.parentId,
    });

    let updatedScheduleItemsMap = updatedItemsMap;
    for (const assigneesTasks of Object.values(group)) {
        const scheduledAssigneesTasks = runScheduling(assigneesTasks.map(getTask));
        for (const assingeeTasks of scheduledAssigneesTasks) {
            for (const sTask of assingeeTasks) {
                const taskToSchedule = patchedTree.getById(sTask.id) as Task;
                const exactStartDate = uuiDayjs.dayjs(sTask.exactStartTime ?? sTask.startTime);
                const formattedStartDate = formatDate(exactStartDate);
                const updatedTaskToSchedule = { ...taskToSchedule, startDate: formattedStartDate };
                if (updatedTaskToSchedule.startDate !== taskToSchedule.startDate || updatedTaskToSchedule.estimate !== taskToSchedule.estimate) {
                    updatedScheduleItemsMap = updatedScheduleItemsMap.set(updatedTaskToSchedule.id, updatedTaskToSchedule);
                }
            }
        }
    }

    const treeAfterScheduling = patch(updatedScheduleItemsMap);

    const subtotals = Tree.computeSubtotals<Task, number, Subtotals>(
        treeAfterScheduling,
        ({ startDate, estimate, dueDate, id, parentId }, hasChildren) => ({
            type: 'entity',
            startDate,
            estimate,
            dueDate,
            id,
            parentId,
            hasChildren,
        }),
        (child1, child2) => ({
            type: 'subtotal',
            forParentId: getForParentId(child1, child2),
            estimate: getEstimate(child1, child2),
            startDate: getStartDate(child1, child2),
            dueDate: getDueDate(child1, child2),
        }),
    );

    Tree.forEach(treeAfterScheduling, (item, id) => {
        if (item.type === 'task') {
            return;
        }
        const itemSubtotals = subtotals.get(id);
        if (itemSubtotals.estimate !== item.estimate || itemSubtotals.startDate !== item.startDate || itemSubtotals.dueDate !== item.dueDate) {
            updatedScheduleItemsMap = updatedScheduleItemsMap.set(id, {
                ...item,
                estimate: itemSubtotals.estimate,
                startDate: itemSubtotals.startDate,
                dueDate: itemSubtotals.dueDate,
            });
        }
    });

    return updatedScheduleItemsMap;
};
