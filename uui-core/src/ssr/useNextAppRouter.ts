import { useEffect, useMemo } from 'react';
import {
    NextAppRouterAdapter, ReadonlySearchParams, TNextAppRouter,
} from '../services/routing/NextAppRouterAdapter';

/**
 * Creates app router adapter instance for Nextjs
 */
export const useNextAppRouter = ({
    router,
    pathname,
    searchParams,
}: {
    router: TNextAppRouter;
    pathname: string;
    searchParams: ReadonlySearchParams;
}) => {
    const appRouterAdapter = useMemo(
        () => new NextAppRouterAdapter(router),
        [router],
    );

    // avoid re-creation router adapter by updating router related stuff here
    useEffect(() => {
        appRouterAdapter.updateURLParams(pathname, searchParams);
    }, [appRouterAdapter, searchParams, pathname]);

    return appRouterAdapter;
};
