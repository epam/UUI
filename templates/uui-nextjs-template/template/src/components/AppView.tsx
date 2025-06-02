'use client';

import {
    DragGhost,
    UuiContext,
    useNextAppRouter,
    useUuiServices,
} from '@epam/uui-core';
import { PropsWithChildren, Suspense } from 'react';
import { ErrorHandler, Snackbar } from '@epam/promo';
import { AppHeader } from './AppHeader';
import { Modals } from '@epam/uui-components';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function AppView({ children }: PropsWithChildren) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const routerAdapter = useNextAppRouter({ router, pathname, searchParams });
    const { services } = useUuiServices({ router: routerAdapter });

    return (
        <UuiContext value={services}>
            <ErrorHandler>
                <AppHeader />
                <Suspense>{children}</Suspense>
                <Snackbar />
                <Modals />
                <DragGhost />
            </ErrorHandler>
        </UuiContext>
    );
}
