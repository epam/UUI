import { IRouterContext, Link } from '@epam/uui-core';

export class TestStubAdaptedRouter implements IRouterContext {
    blockerLister: (link: Link) => void;
    currentLink: Link = { pathname: '/', query: {} };

    public getCurrentLink(): Link {
        return this.currentLink;
    }

    public redirect(link: Link): void {
        if (this.blockerLister) {
            this.blockerLister?.(link);
        }
        this.currentLink = link;
    }

    public transfer(link: Link): void {
        if (this.blockerLister) {
            this.blockerLister?.(link);
        }
        this.currentLink = link;
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
