import { batchOnNextTick } from "../batchOnNextTick";

describe('batchOnNextTick', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('batches function runs to the next tick', async () => {
        const batchFn = jest.fn(() => {});

        const fn = batchOnNextTick(batchFn);
        fn(1);
        fn(2);
        await Promise.resolve();
        expect(batchFn).toBeCalledTimes(1);
        expect(batchFn).toBeCalledWith([1, 2]);
    });

    it('can be used with falsy args', async () => {
        const batchFn = jest.fn(() => {});

        const fn = batchOnNextTick(batchFn);
        fn();
        fn(null);
        fn(NaN);
        await Promise.resolve();
        expect(batchFn).toBeCalledTimes(1);
        expect(batchFn).toBeCalledWith([undefined, null, NaN]);
    });
});