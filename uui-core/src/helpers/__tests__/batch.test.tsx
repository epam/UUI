import { batch } from '../batch';
import { delay } from '@epam/test-utils';

describe('batch', () => {
    jest.useRealTimers();

    it('batches function runs to the next tick', async () => {
        const batchFn = jest.fn((arr: number[]) => Promise.resolve(arr));
        const fn = batch(batchFn);

        const results = await Promise.all([fn(1), fn(2)]);
        expect(results).toEqual([1, 2]);
        expect(batchFn).toBeCalledTimes(1);
        expect(batchFn).toBeCalledWith([1, 2]);
    });

    it('can be used with falsy args', async () => {
        const batchFn = jest.fn((arr: any) => Promise.resolve(arr));
        const fn = batch(batchFn);

        await (fn(), fn(null));
        expect(batchFn).toBeCalledTimes(1);
        expect(batchFn).toBeCalledWith([undefined, null]);
    });

    it('Processes overlapping calls', async () => {
        const batchFn = jest.fn((arr: number[]) => delay(2).then(() => arr));
        const fn = batch(batchFn);

        let r1 = fn(1);
        let r2 = fn(2);
        await delay(1);
        let r3 = fn(3);
        let r4 = fn(4);

        const res = await Promise.all([r1, r2, r3, r4]);

        expect(res).toEqual([1, 2, 3, 4]);
        expect(batchFn).toBeCalledTimes(2);
        expect(batchFn).toBeCalledWith([1, 2]);
        expect(batchFn).toBeCalledWith([3, 4]);
    });

    it('Processes non-overlapping calls', async () => {
        const batchFn = jest.fn((arr: number[]) => delay(2).then(() => arr));
        const fn = batch(batchFn);

        let r1 = fn(1);
        let r2 = fn(2);
        await delay(4);
        let r3 = fn(3);
        let r4 = fn(4);

        const res = await Promise.all([r1, r2, r3, r4]);

        expect(res).toEqual([1, 2, 3, 4]);
        expect(batchFn).toBeCalledTimes(2);
        expect(batchFn).toBeCalledWith([1, 2]);
        expect(batchFn).toBeCalledWith([3, 4]);
    });

    it('Can throttle calls', async () => {
        const batchFn = jest.fn((arr: number[]) => delay(1).then(() => arr));
        const fn = batch(batchFn, { throttleMs: 20 });
        let r1 = fn(1);
        await delay(1); // 1 starts here
        let r2 = fn(2);
        await delay(1);
        let r3 = fn(3);
        await delay(40); // 2 and 3 starts here
        let r4 = fn(4); // this one should be a separate call, as 3 ms passed

        const res = await Promise.all([r1, r2, r3, r4]);

        expect(res).toEqual([1, 2, 3, 4]);
        expect(batchFn).toBeCalledTimes(3);
        expect(batchFn).toBeCalledWith([1]);
        expect(batchFn).toBeCalledWith([2, 3]);
        expect(batchFn).toBeCalledWith([4]);
    });

    it('Errors are passed thru', async () => {
        const batchFn = jest.fn(async (arr: number[]) => {
            await delay(2);
            throw 'My Error';
        });
        const fn = batch(batchFn);

        let r1 = fn(1);
        //await delay(5);
        let r2 = fn(2);

        await expect(r1).rejects.toEqual('My Error');
        await expect(r2).rejects.toEqual('My Error');
        expect(batchFn).toBeCalledTimes(1);
    });

    it('Can recover after error', async () => {
        const batchFn = jest.fn(async (arr: number[]) => {
            await delay(1);
            if (arr[0] == 1) {
                throw 'My Error';
            } else {
                return arr;
            }
        });

        const fn = batch(batchFn);

        let p1 = expect(fn(1)).rejects.toEqual('My Error');
        await delay(5);
        let p2 = expect(fn(2)).resolves.toEqual(2);

        await p1;
        await p2;

        expect(batchFn).toBeCalledTimes(2);
    });

    it('Tracks isBusy correctly', async () => {
        const batchFn = jest.fn((arr: number[]) => delay(2).then(() => arr));
        const fn = batch(batchFn);

        let r1 = fn(1);
        expect(fn.isBusy).toBe(true);
        let r2 = fn(2);
        await delay(4);
        expect(fn.isBusy).toBe(false);
        let r3 = fn(3);
        expect(fn.isBusy).toBe(true);
        let r4 = fn(4);

        await Promise.all([r1, r2, r3, r4]);
        expect(fn.isBusy).toBe(false);
    });
});
