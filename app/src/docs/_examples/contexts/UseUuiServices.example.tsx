import React from "react";
import { UuiContext, HistoryAdaptedRouter, useUuiServices } from '@epam/uui-core';
import { Modals, Snackbar } from "@epam/uui-components";
import { skinContext, ErrorHandler } from "@epam/promo";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default function UuiEnhancedApp() {

    const router = new HistoryAdaptedRouter(history);

    const { services } = useUuiServices({
        apiDefinition: (processRequest) => Promise.resolve({}),
        router,
        skinContext,
        // apiServerUrl: 'url',
        // appContext: {}
    });

    return (
        <UuiContext.Provider value={ services }>
            <ErrorHandler>
                Your App component
            </ErrorHandler>
            <Snackbar />
            <Modals />
        </UuiContext.Provider>
    );
}

// ReactDOM.render(<Router history={ history } > <UuiEnhancedApp /> </Router>, document.getElementById('root'));