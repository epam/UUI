import { IRouterContext, Link } from '../../types';

export interface NavigateOptions {
    scroll?: boolean;
}

export interface PrefetchOptions {
    kind: 'auto' | 'full' | 'temporary';
}

type TNextAppRouter = {
    push(href: string, options?: NavigateOptions): void;
    replace(href: string, options?: NavigateOptions): void;
};

type ReadonlySearchParams = URLSearchParams & {
    append(): void;
    delete(): void;
    set(): void;
    sort(): void;
};

const beforeHistoryChangeEvent = 'beforeHistoryChange';
const blockNavigationEvent = 'blockNavigation';

export class NextAppRouterAdapter implements IRouterContext {
    private isBlockRun: boolean;
    private pathaname?: string;
    private searchParams?: ReadonlySearchParams;

    constructor(private router: TNextAppRouter) {
        this.isBlockRun = false;
    }

    public updateURLParams(
        pathname: string,
        searchParams: ReadonlySearchParams,
    ): void {
        this.pathaname = pathname;
        this.searchParams = searchParams;
    }

    public getCurrentLink(): Link {
        return this.pathaname
            ? parseQuery({
                pathname: this.pathaname,
                query: paramsToQuery(this.searchParams),
            })
            : {
                pathname: undefined,
                query: {},
            };
    }

    public redirect(link: Link): void {
        document.dispatchEvent(createBeforeHistoryEvent());

        if (this.isBlockRun) {
            document.dispatchEvent(createBlockNavigationEvent(link));
        } else {
            const search = link.search ? '?' + link.search : '';
            this.router.push(link.pathname + search);
        }
    }

    public transfer(link: Link): void {
        document.dispatchEvent(createBeforeHistoryEvent());

        if (this.isBlockRun) {
            document.dispatchEvent(createBlockNavigationEvent(link));
        } else {
            const search = link.search ? '?' + link.search : '';
            this.router.replace(link.pathname + search);
        }
    }

    public isActive(link: Link): boolean {
        const current = this.getCurrentLink();
        return current.pathname === link.pathname;
    }

    // See https://nextjs.org/docs/app/api-reference/next-config-js/basePath
    // https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
    public createHref(link: Link): string {
        return createHref(
            link,
            process.env.basePath || process.env.NEXT_PUBLIC_BASE_PATH || '',
        );
    }

    public listen(listener: (link: Link) => void) {
        const onBeforeHistoryChange = (event: Event) => {
            listener((event as any).detail.link);
        };

        document.addEventListener(
            beforeHistoryChangeEvent,
            onBeforeHistoryChange,
        );
        return () => {
            document.removeEventListener(
                beforeHistoryChangeEvent,
                onBeforeHistoryChange,
            );
        };
    }

    // adapter state might be invalid in potential edge case like
    // unblocking one form shouldn't unblock another one
    public block(listener: (link: Link) => void) {
        const onBlockNavigation = (event: Event) => {
            const payload = (event as any).detail;
            listener(payload.link);
        };

        this.isBlockRun = true;
        document.addEventListener(blockNavigationEvent, onBlockNavigation);

        return () => {
            this.isBlockRun = false;
            document.removeEventListener(
                blockNavigationEvent,
                onBlockNavigation,
            );
        };
    }
}

const createBeforeHistoryEvent = () =>
    new CustomEvent(beforeHistoryChangeEvent, {
        detail: {},
    });

const createBlockNavigationEvent = (link: Link) =>
    new CustomEvent(blockNavigationEvent, {
        detail: { link },
    });

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

const paramsToQuery = (params?: ReadonlySearchParams) => {
    return params
        ? [...params.entries()].reduce<Record<string, string>>(
            (acc, [key, value]) => {
                acc[key] = value;
                return acc;
            },
            {},
        )
        : {};
};
