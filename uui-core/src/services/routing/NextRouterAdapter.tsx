import { IRouterContext, Link } from '../../types';
import { queryToSearch } from '../../helpers/queryToSearch';

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

/**
 * Source: https://github.com/vercel/next.js/blob/031cf7009239be5ebccd8f72418adfd2bb4af5c8/packages/next/src/shared/lib/router/router.ts#L657
 * This type is compatible with both versions of Next.js: v13 and v14.
 */
export type TNext14Router = {
    pathname: string,
    basePath: string,
    query: any,
    push(...args: any[]): void,
    replace(...args: any[]): void,
    events: {
        on(type: any, handler: (...evts: any[]) => void): void;
        off(type: any, handler: (...evts: any[]) => void): void;
        emit(type: any): void;
    }
};

export class NextRouterAdapter implements IRouterContext {
    private isBlockRun: boolean;
    private blockedUrl: Link | null;
    constructor(
        private router: TNext14Router,
    ) {
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
        const localHandler = (url: Link) => this.handleBeforeHistoryChange(url, listener);
        this.router.events.on('beforeHistoryChange', localHandler);
        return () => this.router.events.off('beforeHistoryChange', localHandler);
    }

    private handleRouterChangeError = (listener: (link: Link) => void) => {
        listener(this.blockedUrl);
        throw 'Block history changing';
    };

    public block(listener: (link: Link) => void) {
        const localHandler = () => this.handleRouterChangeError(listener);
        this.router.events.on('routeChangeError', localHandler);
        this.isBlockRun = true;

        return () => {
            this.isBlockRun = false;
            this.blockedUrl = null;
            this.router.events.off('routeChangeError', localHandler);
        };
    }
}
