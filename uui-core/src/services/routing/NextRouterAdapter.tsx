import { IRouterContext, Link } from '../../types';
import { queryToSearch } from '../../helpers';

const createHref = (location: Link, basePath: string) => {
    const { pathname, query } = location;
    const search = new URLSearchParams(query).toString();
    return `${basePath}${pathname}${search ? '?' + search : ''}`;
};

const parseQuery = (link: Link): Link => {
    const query = {} as any;
    Object.keys(link.query).forEach((key) => {
        const value = link.query[key];
        if (!value) return;

        try {
            query[key] = JSON.parse(decodeURIComponent(value));
        } catch (e) {
            query[key] = value;
        }
    });

    return {
        ...link,
        query,
    };
};

export class NextRouterAdapter implements IRouterContext {
    private isBlockRun: boolean;
    private blockedUrl: Link | null;
    constructor(private router: any) {
        this.isBlockRun = false;
        this.blockedUrl = null;
    }

    public getCurrentLink(): Link {
        const parsedLink = parseQuery({
            pathname: this.router.pathname,
            query: this.router.query,
        });
        return parsedLink;
    }

    parseLinkWithQuery(link: Link): Link {
        const result = {
            ...link,
            search: queryToSearch(link.query),
        };
        delete result.query;
        return result;
    }

    public redirect(link: Link): void {
        this.router.push(this.parseLinkWithQuery(link));
        if (this.isBlockRun) {
            this.blockedUrl = link;
        }
    }

    public transfer(link: Link): void {
        this.router.replace(this.parseLinkWithQuery(link));
        if (this.isBlockRun) {
            this.blockedUrl = link;
        }
    }

    public isActive(link: Link): boolean {
        const current = this.getCurrentLink();
        return current.pathname === link.pathname;
    }

    public createHref(link: Link): string {
        return createHref(link, this.router.basePath);
    }

    private handleBeforeHistoryChange = (url: Link, listener: (link: Link) => void) => {
        listener(url);
        if (this.isBlockRun && this.blockedUrl) {
            this.router.events.emit('routeChangeError');
        }
    };

    public listen(listener: (link: Link) => void) {
        return this.router.events.on('beforeHistoryChange', (url: Link) => this.handleBeforeHistoryChange(url, listener));
    }

    private handleRouterChangeError = (listener: (link: Link) => void) => {
        listener(this.blockedUrl);
        throw 'Block history changing';
    };

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
