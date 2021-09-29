import { LockContext } from "../LockContext";
import { IRouterContext } from "../../types";

describe("LockContext", () => {
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
    
    it("should create lock", async () => {
        await context.acquire(tryRelease);
        expect(router.block).toBeCalledTimes(1);
        
        const lock = context.getCurrentLock();
        expect(lock.tryRelease).toBe(tryRelease);
    });

    it("should call try release when lock already exists", () => {
        context.withLock(tryRelease);
        expect(tryRelease).not.toBeCalled();
        
        context.withLock(tryRelease);
        expect(tryRelease).toBeCalledTimes(1);
    });

    it("should release lock", () => {
        expect(() => context.release({})).toThrow();
        
        context.acquire(tryRelease);
        const lock = context.getCurrentLock();
        context.release(lock);
        expect(context.getCurrentLock()).toBeNull();
    });

    it("should try release when leaving location", async () => {
        await context.acquire(tryRelease);
        
        context.routerWillLeave({} as any);
        expect(tryRelease).toBeCalledTimes(1);
    });
});