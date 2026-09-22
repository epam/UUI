import React from 'react';
import {
    AuthRecoveryContextProps, IAuthRecoveryService, UuiContext, HistoryAdaptedRouter, useUuiServices,
} from '@epam/uui-core';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

const refreshAccessToken = async () => 'refreshed-access-token';

class CustomAuthRecoveryService implements IAuthRecoveryService {
    constructor(private props: AuthRecoveryContextProps) {}

    init = () => {};
    destroy = () => {};
    tryToRecover = () => {
        refreshAccessToken()
            .then(() => {
                this.props.onSuccessAuthRecovery();
            })
            .catch(() => {
                // Report an authentication error using the application's error handling.
            });
    };
}

export function App() {
    const { services } = useUuiServices({
        router,
        authRecoveryService: CustomAuthRecoveryService,
    });

    return (
        <UuiContext value={ services }>
            App
        </UuiContext>
    );
}
