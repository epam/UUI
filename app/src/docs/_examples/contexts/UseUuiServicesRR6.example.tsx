// Note: please remove @ts-nocheck comment in real app, it's here only because it's our local code example.
// @ts-nocheck
import React from 'react';
import { createRoot } from 'react-dom/client';
import { UuiContext, useUuiServices, DragGhost, Router6AdaptedRouter } from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import { ErrorHandler } from '@epam/promo';
import { svc } from '../../../services';
import { createBrowserRouter } from 'react-router-dom';
import { Route, RouterProvider } from 'react-router';

function MyApp() {
    return (
        <ErrorHandler>
            <Route path="/" Component={ MyPage } />
            <Snackbar />
            <Modals />
            <DragGhost />
        </ErrorHandler>
    );
}

const router6 = createBrowserRouter([
    { path: '*', element: <MyApp /> },
]);
const router = new Router6AdaptedRouter(router6);

function UuiEnhancedApp() {
    const { services } = useUuiServices({ router });
    Object.assign(svc, services);

    return (
        (
            <UuiContext value={ services }>
                <RouterProvider router={ router6 } />
            </UuiContext>
        )
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<UuiEnhancedApp />);
