import { DropPosition, IImmutableMap, IMap, ITree, Tree, getOrderBetween } from '@epam/uui-core';
import { Task } from './types';
import { scheduleTasks as runScheduling, Task as SchedulingTask } from './scheduleTasks';
import { TimelineTransform, msPerDay } from '@epam/uui-timeline';
import { Dayjs, uuiDayjs } from '../../../helpers';
import { statuses } from './demoData';

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

const formatDate = (date: string | number | Dayjs | Date) => uuiDayjs.dayjs(date).toISOString();

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

    Tree.forEach(tree, (task, id, parentId) => {
        const currentTask = updatedValues.get(id) ?? task;

        if (currentTask.type === 'task') {
            const { ids } = tree.getItems(parentId);
            const isLastChild = ids.indexOf(currentTask.id) === ids.length - 1;

            if (currentTask.startDate) {
                lastStoryTasks.push(currentTask);
            }

            if (isLastChild) {
                lastStoryTasks.sort((a, b) => {
                    const startDate1 = new Date(a.startDate).getTime();
                    const startDate2 = new Date(b.startDate).getTime();

                    return compareScalars(startDate1, startDate2, 1);
                });

                tasks.push(lastStoryTasks);
                lastStoryTasks = [];
            }
        }
    }, { direction: 'top-down' });

    return tasks.flat();
};

const toTime = (date: string) => uuiDayjs.dayjs(date).toDate().getTime();
const addEstimate = (date: string, estimate: number) => uuiDayjs
    .dayjs(date)
    .add(estimate, 'day')
    .endOf('day')
    .toDate()
    .getTime();

type Subtotals = {
    type: 'entity';
    startDate: string;
    exactStartDate: string;
    dueDate: string;
    estimate: number;
    id: number;
    status?: string;
    parentId: number;
    hasChildren?: boolean;
} | {
    type: 'subtotal';
    exactStartDate: string;
    dueDate: string;
    status?: string;
    estimate: number;
    forParentId: number;
    hasChildren?: boolean;
};

const getStartDate = (child1: Subtotals, child2: Subtotals) => {
    if (!child1.exactStartDate) {
        return child2.exactStartDate;
    }

    if (!child2.exactStartDate) {
        return child1.exactStartDate;
    }
    return formatDate(Math.min(toTime(child1.exactStartDate), toTime(child2.exactStartDate)));
};

const getChildDueDate = (child: Subtotals) => {
    if (!child.estimate) {
        return child.dueDate ? toTime(child.dueDate) : undefined;
    }

    return child.hasChildren ? undefined : addEstimate(child.exactStartDate, child.estimate - 1);
};

const getDueDateForEntities = (child1: ByType<Subtotals, 'entity'>, child2: ByType<Subtotals, 'entity'>) => {
    return formatDate(Math.max(getChildDueDate(child1), getChildDueDate(child2)));
};

const getDueDateForEntityAndSubtotal = (child1: ByType<Subtotals, 'entity'>, child2: ByType<Subtotals, 'subtotal'>) => {
    if (child1.parentId === child2.forParentId) {
        return formatDate(Math.max(getChildDueDate(child1), getChildDueDate(child2)));
    }

    if (child1.id === child2.forParentId) {
        return formatDate(getChildDueDate(child2));
    }

    return formatDate(Math.max(getChildDueDate(child1), getChildDueDate(child2)));
};

const getDueDateForSubtotals = (child1: Subtotals, child2: Subtotals) => {
    if (child1.type === 'entity') {
        if (child2.type === 'entity') {
            if (child1.parentId === child2.parentId) {
                return getDueDateForEntities(child1, child2);
            }

            if (child1.id === child2.parentId) {
                return child2.dueDate;
            }

            if (child2.id === child1.parentId) {
                return child1.dueDate;
            }

            return getDueDateForEntities(child1, child2);
        }

        return getDueDateForEntityAndSubtotal(child1, child2);
    }

    if (child2.type === 'entity') {
        return getDueDateForEntityAndSubtotal(child2, child1);
    }

    return formatDate(Math.max(getChildDueDate(child1), getChildDueDate(child2)));
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

    return getDueDateForSubtotals(child1, child2);
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

const statusPriorities = statuses.reduce<Record<string, number>>((acc, { id, priority }) => ({ ...acc, [id]: priority }), {});

const getMinStatus = (child1: Subtotals, child2: Subtotals) => {
    if (child1.status === undefined) {
        return child2.status;
    }

    if (child2.status === undefined) {
        return child1.status;
    }

    const child1StatusPriority = statusPriorities[child1.status];
    const child2StatusPriority = statusPriorities[child2.status];

    if (child1StatusPriority < child2StatusPriority) {
        return child1.status;
    }

    return child2.status;
};

const getStatusForEntities = (child1: ByType<Subtotals, 'entity'>, child2: ByType<Subtotals, 'entity'>) => {
    if (child1.status === undefined) {
        return child2.status;
    }

    if (child1.parentId === child2.id) {
        return child1.status;
    }

    if (child2.parentId === child1.id) {
        return child2.status;
    }

    return getMinStatus(child1, child2);
};

const getStatusForEntityAndSubtotal = (child1: ByType<Subtotals, 'entity'>, child2: ByType<Subtotals, 'subtotal'>) => {
    if (child1.parentId === child2.forParentId) {
        return getMinStatus(child1, child2);
    }

    if (child1.id === child2.forParentId) {
        return child2.status;
    }

    return getMinStatus(child1, child2);
};

const getStatusForSubtotals = (child1: ByType<Subtotals, 'subtotal'>, child2: ByType<Subtotals, 'subtotal'>) => {
    if (child1.forParentId === child2.forParentId) {
        return getMinStatus(child1, child2);
    }
    return child1.status;
};

const getStatus = (child1: Subtotals, child2: Subtotals) => {
    if (child1.type === 'entity') {
        if (child2.type === 'entity') {
            return getStatusForEntities(child1, child2);
        }

        return getStatusForEntityAndSubtotal(child1, child2);
    }

    if (child2.type === 'entity') {
        return getStatusForEntityAndSubtotal(child2, child1);
    }

    return getStatusForSubtotals(child1, child2);
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
                const updatedTaskToSchedule = { ...taskToSchedule, exactStartDate: formattedStartDate };
                if (
                    updatedTaskToSchedule.exactStartDate !== taskToSchedule.exactStartDate
                    || updatedTaskToSchedule.estimate !== taskToSchedule.estimate
                ) {
                    updatedScheduleItemsMap = updatedScheduleItemsMap.set(updatedTaskToSchedule.id, updatedTaskToSchedule);
                }
            }
        }
    }

    const treeAfterScheduling = patch(updatedScheduleItemsMap);

    const subtotals = Tree.computeSubtotals<Task, number, Subtotals>(
        treeAfterScheduling,
        ({ startDate, estimate, dueDate, id, parentId, exactStartDate, status }, hasChildren) => ({
            type: 'entity',
            startDate,
            status,
            estimate,
            dueDate,
            id,
            exactStartDate,
            parentId,
            hasChildren,
        }),
        (child1, child2) => ({
            type: 'subtotal',
            forParentId: getForParentId(child1, child2),
            estimate: getEstimate(child1, child2),
            status: getStatus(child1, child2),
            exactStartDate: getStartDate(child1, child2),
            dueDate: getDueDate(child1, child2),
        }),
    );

    Tree.forEach(treeAfterScheduling, (item, id) => {
        if (item.type === 'task') {
            return;
        }
        const itemSubtotals = subtotals.get(id);
        if (itemSubtotals.estimate !== item.estimate
            || itemSubtotals.exactStartDate !== item.exactStartDate
            || itemSubtotals.dueDate !== item.dueDate
            || itemSubtotals.status !== item.status
        ) {
            updatedScheduleItemsMap = updatedScheduleItemsMap.set(id, {
                ...item,
                estimate: itemSubtotals.estimate,
                startDate: itemSubtotals.exactStartDate,
                dueDate: itemSubtotals.dueDate,
                status: itemSubtotals.status,
            });
        }
    });

    return updatedScheduleItemsMap;
};

export const getMinMaxDate = (tree: ITree<Task, number>) => {
    let minStartDate: number | undefined;
    let maxDueDate: number | undefined;
    Tree.forEach(tree, (item) => {
        let estimatedDate;
        let dueDate;
        if (item.startDate) {
            const startDate = new Date(item.startDate);
            const startDateTime = startDate.getTime();
            if (minStartDate === undefined || startDateTime < minStartDate) {
                minStartDate = startDateTime;
            }
            if (item.estimate) {
                startDate.setDate(startDate.getDate() + item.estimate);
                estimatedDate = startDate.getTime();
            }
        }

        if (item.dueDate) {
            dueDate = new Date(item.dueDate).getTime();
        }

        let localMaxDueDate;
        if (estimatedDate === undefined) {
            if (dueDate !== undefined) {
                localMaxDueDate = dueDate;
            }
        } else if (dueDate === undefined) {
            localMaxDueDate = estimatedDate;
        } else {
            localMaxDueDate = Math.max(dueDate, estimatedDate);
        }

        maxDueDate = maxDueDate === undefined ? localMaxDueDate : Math.max(localMaxDueDate ?? 0, maxDueDate);
    });

    let from: Date;
    let to: Date;
    if (minStartDate && maxDueDate) {
        from = new Date();
        from.setTime(minStartDate);
        to = new Date();
        to.setTime(maxDueDate);
    }

    return { from, to };
};

export const getTaskColor = (status: string) => statuses.find((s) => s.id === status)?.color ?? '#e1e3eb';
export const formatDatePickerDate = (date: string | Date) => {
    if (date instanceof Date) {
        return uuiDayjs.dayjs(date).format('DD.MM.YYYY');
    }

    if (!date?.length) {
        return '';
    }

    return uuiDayjs.dayjs(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
};

export const getDueDateFromTask = (task: Task) => {
    if (task.dueDate) {
        return uuiDayjs.dayjs(task.dueDate).toDate();
    }

    return null;
};

export const getEstimatedTo = (task: Task) => {
    if (task.type === 'story') {
        return getDueDateFromTask(task);
    }

    const startDate = uuiDayjs.dayjs(task.exactStartDate);
    if (task.exactStartDate && task.estimate !== undefined) {
        return startDate.add(task.estimate - 1, 'day').endOf('day').toDate();
    }

    return null;
};

export const getTo = (task: Task) => {
    const deadline = task.dueDate ? uuiDayjs.dayjs(task.dueDate).toDate() : null;
    if (task.type === 'story') {
        return deadline;
    }

    const startDate = uuiDayjs.dayjs(task.exactStartDate);
    const estimatedDueDate = task.exactStartDate && task.estimate !== undefined
        ? startDate.add(task.estimate - 1, 'day').endOf('day').toDate()
        : null;

    if (estimatedDueDate) {
        return estimatedDueDate;
    }

    return deadline;
};

export const getTrim = (width: number, left: number, tWidth: number) => {
    if (left < 0) {
        return 'left';
    }

    if (left + width > tWidth) {
        return 'right';
    }

    return undefined;
};

export const getWidth = (from: Date, to: Date, t: TimelineTransform) => {
    const width = t.getX(to) - t.getX(from);
    const originalLeft = t.getX(from);
    const toX = t.getX(to, getTrim(width, originalLeft, t.widthPx));

    const trimmedWidth = toX - Math.max(originalLeft, 0);
    return Math.min(trimmedWidth, t.widthPx);
};

export const getTaskBarWidth = (from: Date, deadline: Date, estimatedTo: Date, t: TimelineTransform) => {
    if (!deadline || deadline.getTime() < from.getTime()) {
        return getWidth(from, estimatedTo, t);
    }

    const to = deadline.getTime() < estimatedTo.getTime() ? deadline : estimatedTo;
    return getWidth(from, to, t);
};
