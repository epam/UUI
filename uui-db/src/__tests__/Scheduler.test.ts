import { Scheduler } from '../Scheduler';

const delay = (t: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, t);
    });

const testApi = async (params: any) => {
    await delay(1);
    return params;
};

describe('db - Scheduler', () => {
    beforeEach(() => {
        // testTask.mockReset();
    });

    it('runs and completes a single task', async () => {
        const scheduler = new Scheduler();
        const testTask = jest.fn(testApi);
        const result = await scheduler.run(() => testTask(123));
        expect(result).toBe(123);
    });
});
