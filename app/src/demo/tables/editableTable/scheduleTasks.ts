/**
 * Mutlifit algorithm implementation.
 */

import { getOrderComparer } from '@epam/uui-core';

export interface Task<TId> {
    id: TId;
    name?: string;
    startTime: number;
    duration: number;
    exactStartTime?: number;
    parentId: number;
}

const orderTasks = <TId>(tasks: Task<TId>[]) => {
    const order = getOrderComparer([
        // { direction: 'asc', field: 'parentId' },
        { direction: 'asc', field: 'startTime' },
        // { direction: 'desc', field: 'duration' },
    ]);
    return [...tasks].sort(order);
};

const binSum = <TId>(bin: Task<TId>[]) =>
    bin.reduce((sum, task) => Math.max(task.duration + sum, task.startTime + task.duration), 0);

const firstFitDecreasing = <TId>(tasks: Task<TId>[], binCapacity: number) => {
    const orderedTasks = orderTasks(tasks);
    const [firstTask, ...restOrderedTasks] = orderedTasks;

    const bins = [[firstTask]];

    for (const task of restOrderedTasks) {
        let taskAdded = false;
        for (const bin of bins) {
            const sum = binSum(bin);
            if (Math.max(sum + task.duration, task.startTime + task.duration) < binCapacity) {
                bin.push({ ...task, exactStartTime: Math.max(sum, task.startTime) });
                taskAdded = true;
            }
        }
        if (!taskAdded) {
            bins.push([task]);
        }
    }

    return bins;
};

export const scheduleTasks = <TId>(tasks: Task<TId>[], assignees: number = 1) => {
    const durationSum = binSum(tasks);
    const maxTaskDuration = tasks.reduce((maxDuration, task) => Math.max(task.duration, maxDuration), 0);
    let lowerBinCapacity = Math.max(durationSum / assignees, maxTaskDuration);
    let upperBinCapacity = Math.max((2 * durationSum) / assignees, maxTaskDuration);
    let k = 1;
    while (k >= 0) {
        const c = Math.floor((lowerBinCapacity + upperBinCapacity) / 2);
        const bins = firstFitDecreasing(tasks, c);
        if (bins.length > assignees) {
            lowerBinCapacity = c;
        } else {
            upperBinCapacity = c;
        }
        k--;
    }

    return firstFitDecreasing(tasks, upperBinCapacity);
};
