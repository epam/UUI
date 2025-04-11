import React from 'react';
import { UuiContext, HistoryAdaptedRouter, useUuiServices } from '@epam/uui-core';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

const myFetch: typeof fetch = (input, init) => {
    const headers = new Headers(init.headers);
    headers.set('my-header', 'header-value');
    return fetch(input, { ...init, headers });
};
export function App() {
    const { services } = useUuiServices({ router, fetch: myFetch });

    return (
        <UuiContext value={ services }>
            App
        </UuiContext>
    );
}
