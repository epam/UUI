import React, { FC, useEffect } from 'react';
import { ApiCallInfo, ApiRecoveryReason, IHasCX, INotification, useUuiContext, useUUIError, UuiError, UuiErrorInfo, UUIRecoveryErrorInfo } from '@epam/uui';

export interface ErrorHandlerProps extends IHasCX {
    getCustomErrorInfo?: (uuiError: UuiError | Error | ApiCallInfo, defaultErrorInfo: UuiErrorInfo) => UuiErrorInfo;
    renderNotification: (notificationProps: INotification, errorMessage: string) => React.ReactNode;
    renderRecoveryBlocker: (errorInfo: UUIRecoveryErrorInfo) => React.ReactNode;
    renderErrorPage: (errorInfo: UuiErrorInfo) => React.ReactNode;
    options: { error: Record<string, UuiErrorInfo>, notification: string, recovery: Record<ApiRecoveryReason, UUIRecoveryErrorInfo> };
}

export const ErrorHandlerImpl: FC<ErrorHandlerProps> = (props) => {
    const [, updateState] = React.useState<object>();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const { uuiErrors, uuiNotifications, uuiModals } = useUuiContext();

    const { errorType, errorInfo } = useUUIError(
        props.getCustomErrorInfo,
        props.options,
    );

    useEffect(() => {
        uuiErrors.onError(() => forceUpdate());
    }, []);

    const showNotifications = (errors: ApiCallInfo[]) => {
        errors.forEach(c => {
            uuiNotifications.show((notificationProps: INotification) => props.renderNotification(notificationProps, (c.responseData && c.responseData.errorMessage) || props.options.notification));
            c.dismissError();
        });
        forceUpdate();
    };

    switch (errorType) {
        case 'recovery':
            return <>
                { props.children }
                { props.renderRecoveryBlocker(errorInfo as UUIRecoveryErrorInfo) }
            </>;
        case 'error':
            uuiModals.closeAll();
            return <>
                { props.renderErrorPage(errorInfo as UuiErrorInfo) }
            </>;
        case 'notification':
            showNotifications(errorInfo as ApiCallInfo[]);
        default:
            return <>
                { props.children }
            </>;
    }
};