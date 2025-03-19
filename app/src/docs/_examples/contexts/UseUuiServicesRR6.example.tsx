// Note: please remove @ts-nocheck comment in real app, it's here only because it's our local code example.
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import { render } from 'react-dom';
import { UuiContext, useUuiServices, DragGhost, Router6AdaptedRouter } from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import { ErrorHandler } from '@epam/promo';
import { svc } from '../../../services';
import { createBrowserRouter } from 'react-router-dom';
import { Route, RouterProvider } from 'react-router';
import React from 'react';

const MyApp = () => {
    return (
        <ErrorHandler>
            <Route path="/" Component={ MyPage } />
            <Snackbar />
            <Modals />
            <DragGhost />
        </ErrorHandler>
    );
};

const router6 = createBrowserRouter([
    { path: '*', element: '<MyApp />' },
]);
const router = new Router6AdaptedRouter(router6);

function UuiEnhancedApp() {
    const { services } = useUuiServices({ router });
    Object.assign(svc, services);

    return (
        <UuiContext.Provider value={ services }>
            <RouterProvider router={ router6 } />
        </UuiContext.Provider>
    );
}

render(<UuiEnhancedApp />, document.getElementById('root'));
