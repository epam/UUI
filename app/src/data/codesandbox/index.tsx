import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';
import { ErrorHandler, FlexRow, skinContext } from '@epam/promo';
import {
    HistoryAdaptedRouter,
    IProcessRequest,
    useUuiServices,
    UuiContext,
} from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import '@epam/uui-components/styles.css';
// eslint-disable-next-line import/no-unresolved
import '@epam/uui/styles.css';
import '@epam/promo/styles.css';
import '@epam/loveship/styles.css';
import Example from './Example';
import { svc, getApi } from './api';

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
    const { services } = useUuiServices<TApi, never>({ apiDefinition, router, skinContext });
    Object.assign(svc, services);

    useEffect(() => {
        setIsLoaded(true);
    }, [services]);

    if (isLoaded) {
        return (
            <UuiContext.Provider value={ services }>
                <ErrorHandler>
                    <FlexRow vPadding="48" padding="24" borderBottom alignItems="top" spacing="12">
                        <Example />
                    </FlexRow>
                    <Snackbar />
                    <Modals />
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
