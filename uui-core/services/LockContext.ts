import { BaseContext } from './BaseContext';
import { IRouterContext, Link } from '../types';

export class Lock {
    constructor(public tryRelease?: () => Promise<void>) {}
}

export class LockContext extends BaseContext {
    private currentLock: Lock | null;
    private unblock: any;

    constructor(private router: IRouterContext) {
        super();
    }

    public acquire(tryRelease?: () => Promise<any>): Promise<Lock | null> {
        if (this.currentLock) {
            return this.tryRelease().then(() => this.acquire(tryRelease));
        } else {
            const lock = new Lock(tryRelease);

            this.unblock = this.router.block(location => {
                this.routerWillLeave(location);
            });

            this.currentLock = lock;
            return Promise.resolve(lock);
        }
    }

    public getCurrentLock(): Lock | null {
        return this.currentLock;
    }

    public tryRelease(): Promise<any> {
        if (this.currentLock) {
            if (this.currentLock.tryRelease) {
                return this.currentLock.tryRelease().then(() => {
                    this.release(this.currentLock);
                });
            } else {
                this.release(this.currentLock);
                return Promise.resolve();
            }
        } else {
            return Promise.reject('Current lock is null');
        }
    }

    public async withLock(action: () => Promise<any>): Promise<Lock | null> {
        const lock = await this.acquire(() => Promise.reject());
        return action().finally(() => this.release(lock));
    }

    public routerWillLeave(nextLocation: Link) {
        if (this.currentLock) {
            this.tryRelease().then(() => {
                this.router.redirect(nextLocation);
            }).catch(() => {});
        }
    }

    public release(lock: Lock) {
        if (lock && this.currentLock == lock) {
            this.currentLock = null;
            this.unblock();
        } else {
            throw new Error("Attempting to release a lock, which wasn't acquired");
        }
    }
}
