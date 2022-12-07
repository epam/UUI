import { IRouterContext, Link } from "../../types";

const createHref = (location: Link, basePath: string) => {
    const { pathname, query } = location;
    const search = new URLSearchParams(query).toString();
    return `${basePath}${pathname}${search ? '?' + search : ''}`;
};

export class NextRouterAdapter implements IRouterContext {

    private isBlockRun: boolean;
    private blockedUrl: Link | null;

    constructor(private router: any) {
        this.isBlockRun = false;
        this.blockedUrl = null;
    }

    public getCurrentLink(): Link {
        return {
            pathname: this.router.pathname,
            query: this.router.query,
        };
    }

    public redirect(link: Link): void {
        this.router.push(link);
        if (this.isBlockRun) {
            this.blockedUrl = link;
        }
    }

    public transfer(link: Link): void {
        this.router.replace(link);
        if (this.isBlockRun) {
            this.blockedUrl = link;
        }
    }

    public isActive(link: Link): boolean {
        const current = this.getCurrentLink();
        return current.pathname == link.pathname;
    }

    public createHref(link: Link): string {
        return createHref(link, this.router.basePath);
    }

    private handleBeforeHistoryChange = (url: Link, listener: (link: Link) => void) => {
        listener(url);
        if (this.isBlockRun && this.blockedUrl) {
            this.router.events.emit("routeChangeError");
        }
    }

    public listen(listener: (link: Link) => void) {
        return this.router.events.on('beforeHistoryChange', (url: Link) => this.handleBeforeHistoryChange(url, listener));
    }

    private handleRouterChangeError = (listener: (link: Link) => void) => {
        listener(this.blockedUrl);
        // tslint:disable-next-line:no-string-throw
        throw 'Block history changing';
    }

    public block(listener: (link: Link) => void) {
        this.router.events.on('routeChangeError', () => this.handleRouterChangeError(listener));
        this.isBlockRun = true;

        return () => {
            this.isBlockRun = false;
            this.blockedUrl = null;
        };
    }

    public unSubscribe() {
        this.router.events.off('routeChangeError', this.handleRouterChangeError);
        this.router.events.off('beforeHistoryChange', this.handleBeforeHistoryChange);
    }

}