import React from "react";
import { ContextProvider, useUuiContext } from "@epam/uui";
import { Modals, Snackbar } from "@epam/uui-components";
import { ErrorHandler } from '@epam/loveship';
import { skinContext as promoSkinContext } from "@epam/promo";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default function UuiEnhancedApp() {
    const svc = useUuiContext();

    return (
        <ContextProvider
        loadAppContext={ (api) => Promise.resolve({}) }
        onInitCompleted={ (context) => { Object.assign(svc, context); } }
        history={ history }
        gaCode={ 'Code of our Google Analytics account' }
        skinContext={ promoSkinContext } /* It's needed for some packages correct work, for example - @epam/uui-editor*/
    >
            <ErrorHandler>
                Your App component
            </ErrorHandler>
            <Snackbar />
            <Modals />
        </ContextProvider>
    );
}

// ReactDOM.render(<Router history={ history } > <UuiEnhancedApp /> </Router>, document.getElementById('root'));