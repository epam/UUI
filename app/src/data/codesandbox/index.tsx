import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';
import { ErrorHandler, FlexRow } from '@epam/promo';
import {
    HistoryAdaptedRouter,
    IProcessRequest,
    useUuiServices,
    UuiContext,
    DragGhost,
} from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import { Settings, settings } from '@epam/uui';
import { settings_override } from './settings';
import '@epam/uui-components/styles.css';
// eslint-disable-next-line import/no-unresolved
import '@epam/uui/styles.css';
import '@epam/promo/styles.css';
import '@epam/loveship/styles.css';
/* eslint-disable */
"<UUI_CURRENT_THEME_IMPORT>"
import '@epam/uui-docs/styles.css';
import Example from './Example';
import { svc, getApi } from './api';
/* eslint-enable */

settings.sizes = {
    ...settings.sizes,
    ...(settings_override as Settings).sizes,
};

type TApi = ReturnType<typeof getApi>;

const rootElement = document.getElementById('root');
const origin = process.env.REACT_APP_PUBLIC_URL;

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

function apiDefinition(processRequest: IProcessRequest) {
    return getApi({ processRequest, fetchOptions: { credentials: undefined }, origin });
}

function UuiEnhancedApp() {
    const [isLoaded, setIsLoaded] = useState(false);
    const { services } = useUuiServices<TApi, never>({ apiDefinition, router });

    useEffect(() => {
        Object.assign(svc, services);
        setIsLoaded(true);
    }, [services]);

    if (isLoaded) {
        return (
            <UuiContext.Provider value={ services }>
                <ErrorHandler>
                    <FlexRow vPadding="48" padding="24" borderBottom alignItems="top" columnGap="12">
                        <Example />
                    </FlexRow>
                    <Snackbar />
                    <Modals />
                    <DragGhost />
                </ErrorHandler>
            </UuiContext.Provider>
        );
    }
    return null;
}

render(
    <UuiEnhancedApp />,
    rootElement,
);
