export function batchOnNextTick<T>(runBatch: (batch: T[]) => void): (arg?: T) => void {
    let queue: T[] = [];
    let isScheduled = false;

    return function (arg?: T) {
        queue.push(arg);
        if (!isScheduled) {
            isScheduled = true;
            Promise.resolve().then(() => {
                runBatch(queue);
                queue = [];
                isScheduled = false;
            });
        }
    };
}