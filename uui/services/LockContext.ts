import { BaseContext } from './BaseContext';
import { IRouterContext } from '../types';

export class Lock {
    constructor(public tryRelease: () => Promise<void>) {

    }
}

export interface LockRequest {
}

export class LockContext extends BaseContext {
    private currentLock: Lock | null;
    private unblock: any;

    constructor(private router: IRouterContext) {
        super();
    }

    public acquire(tryRelease: () => Promise<any>): Promise<Lock | null> {
        if (this.currentLock) {
            return this.tryRelease().then(() => this.acquire(tryRelease)).catch(() => this.currentLock);
        } else {
            const lock = new Lock(tryRelease);

            this.unblock = this.router.block(((location: Location) => {
                this.routerWillLeave(location);
            }) as any);

            this.currentLock = lock;
            return Promise.resolve(lock);
        }
    }

    public getCurrentLock(): Lock | null {
        return this.currentLock;
    }

    private tryRelease() {
        if (this.currentLock) {
            return this.currentLock.tryRelease().then(() => {
                this.currentLock = null;
                this.unblock();
            });
        } else {
            return Promise.reject('Current lock is null');
        }
    }

    public withLock(action: () => Promise<any>): Promise<Lock | null> {
        if (this.currentLock) {
            return this.tryRelease().then(() => this.acquire(action));
        } else {
            return this.acquire(action);
        }
    }

    public routerWillLeave(nextLocation: Location) {
        if (this.currentLock) {
            this.tryRelease().then(() => {
                this.router.redirect(nextLocation);
            });
        }
    }

    public release(lock: object) {
        if (lock && this.currentLock == lock) {
            this.currentLock = null;
            this.unblock();
        } else {
            throw new Error("Attempting to release a lock, which wasn't acquired");
        }
    }
}
