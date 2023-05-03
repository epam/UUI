import { LockContext } from '../LockContext';
import { IRouterContext } from '../../types';

describe('LockContext', () => {
    let context: LockContext;
    let router: IRouterContext;
    let tryRelease = jest.fn();

    beforeEach(() => {
        tryRelease = jest.fn().mockImplementation(() => Promise.resolve());
        router = {
            block: jest.fn().mockImplementation(() => jest.fn()),
            redirect: jest.fn(),
        } as any;
        context = new LockContext(router);
    });

    it('should create lock', async () => {
        const lock = await context.acquire(tryRelease);
        expect(router.block).toBeCalledTimes(1);

        expect(context.getCurrentLock()).toBe(lock);
    });

    it('should call try release when lock already exists', async () => {
        await context.acquire(tryRelease);
        expect(tryRelease).not.toBeCalled();

        await context.acquire();
        expect(tryRelease).toBeCalledTimes(1);
    });

    it('should leave lock if try release reject promise', async () => {
        const tryReleaseWithReject = jest.fn().mockImplementation(() => Promise.reject());
        const lock = await context.acquire(tryReleaseWithReject);

        await expect(context.acquire()).rejects.toEqual(undefined);

        expect(tryReleaseWithReject).toBeCalledTimes(1);
        expect(context.getCurrentLock()).toBe(lock);
    });

    it('should acquire lock without tryRelease call back and release it immediately', async () => {
        const lock = await context.acquire();
        expect(context.getCurrentLock()).toBe(lock);

        const newLock = await context.acquire(tryRelease);

        expect(context.getCurrentLock()).toBe(newLock);
    });

    it('should release lock', () => {
        expect(() => context.release({ tryRelease: () => Promise.resolve() })).toThrow();

        context.acquire(tryRelease);
        const lock = context.getCurrentLock();
        context.release(lock);
        expect(context.getCurrentLock()).toBeNull();
    });

    it('should try release when leaving location', async () => {
        await context.acquire(tryRelease);

        context.routerWillLeave({} as any);
        expect(tryRelease).toBeCalledTimes(1);
    });

    it('withLock should get lock until action running and then release it', async () => {
        const lock = await context.acquire(tryRelease);
        const action = jest.fn().mockImplementation(async () => {
            await expect(context.tryRelease()).rejects.toEqual(undefined);
        });

        await context.withLock(action);

        expect(lock.tryRelease).toBeCalledTimes(1);
        expect(action).toBeCalledTimes(1);
        expect(context.getCurrentLock()).toEqual(null);
    });
});
