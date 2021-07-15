import React from "react";
import { ContextProvider } from "@epam/uui";
import { Modals, Snackbar } from "@epam/uui-components";
import { ErrorHandler } from '@epam/loveship';
import { skinContext as promoSkinContext } from "@epam/promo";
import { svc } from '@epam/uui-docs';

export default function UuiEnhancedApp() {
    return (
        <ContextProvider
            loadAppContext={(api) => Promise.resolve({})}
            onInitCompleted={(context) => Object.assign(svc, context) }
            gaCode='Code of our Google Analytics account'
            ampCode='Code of our Amplitude account'
            skinContext={promoSkinContext} /* It's needed for some packages correct work, for example - @epam/uui-editor*/
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