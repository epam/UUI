export interface BatchPromiseOptions {
    /** Minimum time (in ms) to pass after the last call, before triggering the batch */
    throttleMs?: number;
}

const delay = (ms: number = 0): Promise<void> => {
    if (ms <= 0) {
        return Promise.resolve();
    } else {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
};

/** Creates an async function, which can collect several calls to it, and execute them in a single batch via provided callback. */
export function batch<TArg = void, TRes = void>(
    runBatch: (batch?: TArg[]) => Promise<TRes[]> | Promise<void> | undefined | void,
    options?: BatchPromiseOptions,
): { (arg: TArg, options?: BatchPromiseOptions): Promise<TRes>; isBusy: boolean } {
    let delayPromise: Promise<void> = Promise.resolve();
    let batchPromise: any = null;
    let queue: TArg[] = [];

    let nextCallPossibleAtMs = new Date().getTime();

    async function batchedFn(arg: TArg, callOptions?: BatchPromiseOptions) {
        options = { ...options, ...callOptions };
        options.throttleMs = options.throttleMs || 0;

        // Enqueue request
        queue.push(arg);
        const resultIndex = queue.length - 1; // an index of current item in queue. Result should be on the same index in batch.
        batchedFn.isBusy = true;

        // Wait current batch to complete
        try {
            await batchPromise;
        } catch {
            // ignore errors here. They are thrown to previous batch
        }

        // Wait for throttling delay to pass
        await delayPromise;

        try {
            // Start a batch if there are items.
            // All calls that was awaiting will run this code.
            // Only the first call will run batch, immediately clear the queue, and set batchPromise value
            // Other calls will just await results of this call
            if (queue.length > 0) {
                nextCallPossibleAtMs = new Date().getTime() + options.throttleMs;
                batchPromise = runBatch(queue);
                queue = [];
            }

            const results = await batchPromise;

            return results?.[resultIndex];
        } finally {
            const nowMs = new Date().getTime();
            const delayMs = Math.max(0, nextCallPossibleAtMs - nowMs);
            // It's safe to replace currentPromise here. All other requests are already awaiting
            delayPromise = delay(delayMs);
            batchedFn.isBusy = queue.length > 0;
        }
    }

    batchedFn.isBusy = false;

    return batchedFn;
}
