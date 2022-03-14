import { batchOnNextTick } from "../batchOnNextTick";

const delay = (t) => new Promise(resolve => setTimeout(resolve, t));

describe('batchOnNextTick', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('batches function runs to the next tick', async () => {
        const batchFn = jest.fn((arr: number[]) => Promise.resolve(arr));

        const fn = batchOnNextTick(batchFn);
        const results = await Promise.all([fn(1), fn(2)]);
        expect(results).toEqual([1, 2]);
        expect(batchFn).toBeCalledTimes(1);
        expect(batchFn).toBeCalledWith([1, 2]);
    });

    it('can be used with falsy args', async () => {
        const batchFn = jest.fn((arr: any) => Promise.resolve(arr));
        const fn = batchOnNextTick(batchFn);
        await (fn(), fn(null));
        expect(batchFn).toBeCalledTimes(1);
        expect(batchFn).toBeCalledWith([undefined, null]);
    });

    it('Processes overlapping calls', async () => {
        const batchFn = jest.fn((arr: number[]) => delay(2).then(() => arr));

        const fn = batchOnNextTick(batchFn);
        let r1 = fn(1);
        let r2 = fn(2);
        await Promise.resolve();
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

        const fn = batchOnNextTick(batchFn);
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
});