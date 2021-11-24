import React, { FC, useEffect } from 'react';
import { ApiCallInfo, IHasCX, INotification, useUuiContext, UuiError, UuiErrorInfo, UUIRecoveryErrorInfo } from '@epam/uui';
import { ModalBlocker, ModalHeader, ModalWindow, FlexCell, FlexRow, RichTextView, Text, Spinner, ErrorNotification } from '../';
import { ErrorCatch, ErrorHandlerImpl } from '@epam/uui-components';
import { recoveryWordings, defaultErrorPageConfig, defaultNotificationErrorMessage } from './constants';
import { ErrorPage } from './ErrorPage';
import * as css from './ErrorHandler.scss';

export interface ErrorHandlerProps extends IHasCX {
    getCustomErrorInfo?: (uuiError: UuiError | Error | ApiCallInfo, defaultErrorInfo: UuiErrorInfo) => UuiErrorInfo;
}

export const ErrorHandler: FC<ErrorHandlerProps> = (props) => {
    const [, updateState] = React.useState<object>();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const { uuiErrors } = useUuiContext();

    useEffect(() => {
        uuiErrors.onError(() => forceUpdate());
    }, []);

    const renderNotifications = (notificationProps: INotification, errorMessage: string) => <ErrorNotification { ...notificationProps } >
                    <Text size='36' fontSize='14'>{ errorMessage }</Text>
                </ErrorNotification>;

    const renderRecoveryBlocker = (errorInfo: UUIRecoveryErrorInfo) => {
        const { title, text } = errorInfo;

        return (
            <ModalBlocker cx={ css.modalBlocker } blockerShadow='dark' key='auth-lost' isActive={ true } zIndex={ 100500 } success={ () => { } } abort={ () => { } }>
                <ModalWindow>
                    <ModalHeader borderBottom title={ title } />
                    <Spinner cx={ css.recoverySpinner } color='blue' />
                    <FlexRow padding='24' cx={ css.recoveryMessage }>
                        <FlexCell grow={ 1 }>
                            <RichTextView>{ text }</RichTextView>
                        </FlexCell>
                    </FlexRow>
                </ModalWindow>
            </ModalBlocker>
        );
    };

    const renderErrorPage = (errorInfo: UuiErrorInfo) => {
        return <ErrorPage cx={ props.cx } { ...errorInfo } />;
    };

    return <ErrorCatch>
        <ErrorHandlerImpl
            { ...props }
            renderErrorPage={ renderErrorPage }
            renderNotification={ renderNotifications }
            renderRecoveryBlocker={ renderRecoveryBlocker }
            options={ { error: defaultErrorPageConfig, notification: defaultNotificationErrorMessage, recovery: recoveryWordings } }
        >
            { props.children }
        </ErrorHandlerImpl>
    </ErrorCatch>;
};