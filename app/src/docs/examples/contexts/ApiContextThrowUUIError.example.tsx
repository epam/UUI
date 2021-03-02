import React from 'react';
import { LinkButton } from '@epam/loveship';
import { UuiError } from '@epam/uui';
import { svc } from '../../../services';

/**
 * While UUI handles server errors automatically, often you need to trigger errors from your code, and customize their appearance.
 */
export function ErrorsExample() {
    const [state, setState] = React.useState(0);

    switch (state) {
        // JavaScript errors during rendering are caught automatically, in ErrorHandler.componentDidThrow
        // You can throw plain JS Errors, which would result standard 500 screen.
        case 1: throw new Error("Test"); break;

        // Also, you can throw UuiError, which allows to customize the Error page type via status
        case 2: throw new UuiError({ status: 403 });

        // You can override default title, subtitle, and image:
        case 3: throw new UuiError({
            status: 403,
            title: "This error was produced intentionally for demo purposes",
            subtitle: <LinkButton caption='Reload page' onClick={ () => window.location.reload() }/>,
            imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/uui-react/error-images/maintenance.svg',
        });
    }

    return (
        <div>
            <LinkButton caption='Plain Error' onClick={ () => setState(1) } />
            <LinkButton caption='UUI Error' onClick={ () => setState(2) } />
            <LinkButton caption='UUI Error - custom' onClick={ () => setState(3) } />
            <LinkButton
                caption='Error in callback'
                onClick={ () => {
                    // Errors in callbacks can't be caught automatically by React.
                    // In such cases, you can set error state manually via uuiError context
                    svc.uuiErrors.reportError(new UuiError({ status: 404 }));
                } }
            />
        </div>
    );
}