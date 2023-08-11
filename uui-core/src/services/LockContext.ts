import { BaseContext } from './BaseContext';
import { Link } from '../types/objects';
import { IRouterContext } from '../types/contexts';
import { isClientSide } from '../helpers/ssr';

export class Lock {
    constructor(public tryRelease?: () => Promise<void>) {}
}

export class LockContext extends BaseContext {
    private currentLock: Lock | null;
    private unblock: any;
    constructor(private router: IRouterContext) {
        super();
    }

    public destroyContext() {
        this.clearLock();
        super.destroyContext();
    }

    public acquire(tryRelease?: () => Promise<any>): Promise<Lock | null> {
        if (this.currentLock) {
            return this.tryRelease().then(() => this.acquire(tryRelease));
        } else {
            const lock = new Lock(tryRelease);
            if (isClientSide) {
                this.unblock = this.router.block((location) => {
                    this.routerWillLeave(location);
                });
                this.currentLock = lock;
            } else {
                console.warn("An attempt to acquire lock in server side won't have any effect.");
            }
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
                    this.clearLock();
                });
            } else {
                this.clearLock();
                return Promise.resolve();
            }
        } else {
            return Promise.reject('Current lock is null');
        }
    }

    public async withLock<T = any>(action: () => Promise<T>): Promise<T> {
        await this.acquire(() => Promise.reject());
        return action().finally(() => this.clearLock());
    }

    public routerWillLeave(nextLocation: Link) {
        if (this.currentLock) {
            this.tryRelease()
                .then(() => {
                    this.router.redirect(nextLocation);
                })
                .catch(() => {});
        }
    }

    private clearLock() {
        this.currentLock = null;
        this.unblock?.();
    }

    public release(lock: Lock) {
        if (lock && this.currentLock === lock) {
            this.clearLock();
        } else {
            throw new Error("Attempting to release a lock, which wasn't acquired");
        }
    }
}
