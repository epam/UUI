import React, { FC } from 'react';
import { ApiCallInfo, IHasCX, INotification, useUuiContext, useUuiError, UuiError, UuiErrorInfo, UuiRecoveryErrorInfo } from '@epam/uui';
import { ModalBlocker, ModalHeader, ModalWindow, FlexCell, FlexRow, RichTextView, Text, Spinner, ErrorNotification } from '../';
import { ErrorCatch } from '@epam/uui-components';
import { getErrorPageConfig, getRecoveryMessageConfig } from './config';
import { ErrorPage } from './ErrorPage';
import * as css from './ErrorHandler.scss';

export interface ErrorHandlerProps extends IHasCX {
    getErrorInfo?: (uuiError: UuiError | Error | ApiCallInfo, defaultErrorInfo: UuiErrorInfo) => UuiErrorInfo;
}

export const ErrorHandler: FC<ErrorHandlerProps> = (props) => {
    const { uuiNotifications, uuiModals } = useUuiContext();
    const { errorType, errorInfo } = useUuiError({
        getCustomInfo: props.getErrorInfo,
        options: { errorConfig: getErrorPageConfig(), recoveryConfig: getRecoveryMessageConfig() },
    });

    const showNotifications = (errors: ApiCallInfo[]) => {
        errors.forEach(c => {
            uuiNotifications.show((notificationProps: INotification) => <ErrorNotification { ...notificationProps } >
                <Text size='36' fontSize='14'>{ c.responseData && c.responseData.errorMessage }</Text>
            </ErrorNotification>);
            c.dismissError();
        });
    };

    const renderRecoveryBlocker = (errorInfo: UuiRecoveryErrorInfo) => {
        const { title, subtitle } = errorInfo;

        return (
            <ModalBlocker cx={ css.modalBlocker } blockerShadow='dark' key='auth-lost' isActive={ true } zIndex={ 100500 } success={ () => { } } abort={ () => { } }>
                <ModalWindow>
                    <ModalHeader borderBottom title={ title } />
                    <Spinner cx={ css.recoverySpinner } color='blue' />
                    <FlexRow padding='24' cx={ css.recoveryMessage }>
                        <FlexCell grow={ 1 }>
                            <RichTextView>{ subtitle }</RichTextView>
                        </FlexCell>
                    </FlexRow>
                </ModalWindow>
            </ModalBlocker>
        );
    };

    const renderErrorPage = (errorInfo: UuiErrorInfo) => {
        return <ErrorPage cx={ props.cx } { ...errorInfo } />;
    };

    const renderApp = () => {
        switch (errorType) {
            case 'recovery':
                return <>
                    { props.children }
                    { renderRecoveryBlocker(errorInfo as UuiRecoveryErrorInfo) }
                </>;
            case 'error':
                uuiModals.closeAll();
                return <>
                    { renderErrorPage(errorInfo as UuiErrorInfo) }
                </>;
            case 'notification':
                showNotifications(errorInfo as ApiCallInfo[]);
            default:
                return <>
                    { props.children }
                </>;
        }
    };

    return <ErrorCatch>
        { renderApp() }
    </ErrorCatch>;
};