import { createRoot } from 'react-dom/client';
import React, { useEffect, useState } from 'react';
// @ts-ignore
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
import { settings } from '@epam/uui';
import { settings_override } from './settings';
import '@epam/uui-components/styles.css';
// eslint-disable-next-line import/no-unresolved
import '@epam/uui/styles.css';
import '@epam/promo/styles.css';
import '@epam/loveship/styles.css';
import '@epam/uui-editor/styles.css';
/* eslint-disable */
"<UUI_CURRENT_THEME_IMPORT>"
import '@epam/uui-docs/styles.css';
import Example from './Example';
import { svc, getApi } from './api';
import deepmerge from 'deepmerge';
/* eslint-enable */

const merged = deepmerge(settings, settings_override ?? {});
Object.assign(settings, merged);

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
            (
                <UuiContext value={ services }>
                    <ErrorHandler>
                        <FlexRow vPadding="48" padding="24" borderBottom alignItems="top" columnGap="12">
                            <Example />
                        </FlexRow>
                        <Snackbar />
                        <Modals />
                        <DragGhost />
                    </ErrorHandler>
                </UuiContext>
            )
        );
    }
    return null;
}

const root = createRoot(rootElement);
root.render(<UuiEnhancedApp />);
