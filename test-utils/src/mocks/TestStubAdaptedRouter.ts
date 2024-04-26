import { IRouterContext, Link } from '@epam/uui-core';

export class TestStubAdaptedRouter implements IRouterContext {
    blockerLister: (link: Link) => void;

    public getCurrentLink(): Link {
        return { pathname: '', query: {} };
    }

    public redirect(): void {
        this.blockerLister?.(this.getCurrentLink());
    }

    public transfer(): void {
        this.blockerLister?.(this.getCurrentLink());
    }

    public isActive(): boolean {
        return false;
    }

    public createHref(): string {
        return '';
    }

    public listen(): () => void {
        return () => {};
    }

    public block(lister: (link: Link) => void): () => void {
        this.blockerLister = lister;
        return () => { this.blockerLister = null; };
    }
}
