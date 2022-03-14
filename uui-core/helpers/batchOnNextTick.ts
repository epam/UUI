export function batchOnNextTick<TArg = void, TRes = void>(
    runBatch: (batch?: TArg[]) => Promise<TRes[]> | Promise<void> | undefined | void
): (arg: TArg) => Promise<TRes> {
    let currentPromise: Promise<any> = Promise.resolve();
    let queue: TArg[] = [];

    return async function(arg: TArg) {
        queue.push(arg);
        let resultIndex = queue.length - 1; // an index of current item in queue. Result should be on the same index in batch.

        try {
            // Wait current batch to complete, or just a next tick.
            await currentPromise;

            // Start a batch if there are items.
            // Note - the first function to run will clear the queue, so other's won't enter this block
            if (queue.length > 0) {
                let result = runBatch(queue);
                if (result) {
                    currentPromise = result;
                } else {
                    currentPromise = Promise.resolve();
                }

                queue = [];
            }

            const results = await currentPromise;
            return results?.[resultIndex];
        }
        finally {
            currentPromise = Promise.resolve([]);
        }
    };
}