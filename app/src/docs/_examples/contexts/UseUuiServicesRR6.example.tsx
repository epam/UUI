// Note: please remove @ts-nocheck comment in real app, it's here only because it's our local code example.
// @ts-nocheck
import { render } from 'react-dom';
import { UuiContext, useUuiServices, DragGhost, Router6AdaptedRouter } from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import { ErrorHandler } from '@epam/promo';
import { svc } from '../../../services';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';

const router6 = createBrowserRouter([
    { path: '*', element: '<YourAppComponent />' },
]);
const router = new Router6AdaptedRouter(router6);

function UuiEnhancedApp() {
    const { services } = useUuiServices({ router });
    Object.assign(svc, services);

    return (
        <UuiContext.Provider value={ services }>
            <ErrorHandler>
                <RouterProvider router={ router6 } />
            </ErrorHandler>
            <Snackbar />
            <Modals />
            <DragGhost />
        </UuiContext.Provider>
    );
}

render(<UuiEnhancedApp />, document.getElementById('root'));
