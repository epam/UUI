import React from 'react';
import { ApiCallInfo, IHasCX, INotification, useUuiContext, useUuiError, UuiRecoveryErrorInfo, IHasChildren, ErrorPageInfo, UuiError } from '@epam/uui-core';
import { FlexCell, ModalBlocker, ModalHeader, Spinner, ErrorNotification, RichTextView, Anchor } from '../';
import { ModalWindow } from '../overlays';
import { FlexRow } from '../layout';
import { Text } from '../typography';

import { ErrorCatch } from '@epam/uui-components';
import { getErrorPageConfig, getRecoveryMessageConfig } from './config';
import { ErrorPage } from './ErrorPage';
import css from './ErrorHandler.module.scss';

export interface ErrorHandlerProps extends IHasCX, IHasChildren {
    /** Pure function to get error info for display based on error.
     * If omitted, error info from default config will be used.
     */
    getErrorInfo?: (uuiError: UuiError | Error | ApiCallInfo, defaultErrorInfo: ErrorPageInfo) => ErrorPageInfo;
    /** Callback to handle notification error.
     * If omitted, default implementation with ErrorNotification will be used.
     * */
    onNotificationError?: (errors: ApiCallInfo) => void;
}

export function ErrorHandler(props: ErrorHandlerProps) {
    const { uuiNotifications, uuiModals, uuiApi } = useUuiContext();
    const { errorType, errorInfo } = useUuiError({
        getErrorInfo: props.getErrorInfo,
        options: { errorConfig: getErrorPageConfig(), recoveryConfig: getRecoveryMessageConfig() },
    });
    const isAuthLost = uuiApi.recoveryReason === 'auth-lost';

    const showNotifications = (errors: ApiCallInfo[]) => {
        errors.forEach((c) => {
            if (props.onNotificationError) {
                props.onNotificationError(c);
            } else {
                uuiNotifications.show((notificationProps: INotification) => (
                    <ErrorNotification { ...notificationProps }>
                        <Text>
                            {c.responseData && c.responseData.errorMessage}
                        </Text>
                    </ErrorNotification>
                ));
            }
            c.dismissError();
        });
    };

    const renderRecoveryBlocker = (errorInform: UuiRecoveryErrorInfo) => {
        const { title, subtitle } = errorInform;

        return (
            <ModalBlocker key="recovery-blocker" cx={ css.modalBlocker } isActive={ true } zIndex={ 100500 } success={ () => {} } abort={ () => {} }>
                <ModalWindow>
                    <ModalHeader borderBottom title={ title } />
                    <Spinner cx={ css.recoverySpinner } />
                    <FlexRow cx={ css.recoveryMessage }>
                        <FlexCell grow={ 1 }>
                            <RichTextView>{subtitle}</RichTextView>
                            { isAuthLost && (
                                <Text color="tertiary">
                                    We have redirected you to the login page, if the page didn't open, please click on this
                                    { ' ' }
                                    <Anchor href={ uuiApi.apiReloginPath } target="_blank">
                                        link
                                    </Anchor>
                                    .
                                </Text>
                            ) }
                        </FlexCell>
                    </FlexRow>
                </ModalWindow>
            </ModalBlocker>
        );
    };

    const renderErrorPage = (errorInform: ErrorPageInfo) => {
        return <ErrorPage cx={ props.cx } { ...errorInform } />;
    };

    if (errorType === 'error') {
        uuiModals.closeAll();
        return renderErrorPage(errorInfo as ErrorPageInfo);
    }

    if (errorType === 'notification') {
        showNotifications(errorInfo as ApiCallInfo[]);
    }

    return (
        <ErrorCatch>
            {props.children}
            {errorType === 'recovery' && renderRecoveryBlocker(errorInfo as UuiRecoveryErrorInfo)}
        </ErrorCatch>
    );
}
