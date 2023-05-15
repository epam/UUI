import React, { FC } from 'react';
import {
    ApiCallInfo, IHasCX, INotification, useUuiContext, useUuiError, UuiError, UuiErrorInfo, UuiRecoveryErrorInfo, IHasChildren,
} from '@epam/uui-core';
import {
    ModalBlocker, ModalHeader, ModalWindow, FlexCell, FlexRow, RichTextView, Text, Spinner, ErrorNotification,
} from '../../components';
import { ErrorCatch } from '@epam/uui-components';
import { getErrorPageConfig, getRecoveryMessageConfig } from './config';
import { ErrorPage } from './ErrorPage';
import css from './ErrorHandler.module.scss';

export interface ErrorHandlerProps extends IHasCX, IHasChildren {
    getErrorInfo?: (uuiError: UuiError | Error | ApiCallInfo, defaultErrorInfo: UuiErrorInfo) => UuiErrorInfo;
}

export const ErrorHandler: FC<ErrorHandlerProps> = (props) => {
    const { uuiNotifications, uuiModals } = useUuiContext();
    const { errorType, errorInfo } = useUuiError({
        getErrorInfo: props.getErrorInfo,
        options: { errorConfig: getErrorPageConfig(), recoveryConfig: getRecoveryMessageConfig() },
    });

    const showNotifications = (errors: ApiCallInfo[]) => {
        errors.forEach((c) => {
            uuiNotifications.show((notificationProps: INotification) => (
                <ErrorNotification { ...notificationProps }>
                    <Text size="36">
                        {c.responseData && c.responseData.errorMessage}
                    </Text>
                </ErrorNotification>
            ));
            c.dismissError();
        });
    };

    const renderRecoveryBlocker = (errorInfo: UuiRecoveryErrorInfo) => {
        const { title, subtitle } = errorInfo;

        return (
            <ModalBlocker key="recovery-blocker" cx={ css.modalBlocker } blockerShadow="dark" isActive={ true } zIndex={ 100500 } success={ () => {} } abort={ () => {} }>
                <ModalWindow>
                    <ModalHeader borderBottom title={ title } />
                    <Spinner cx={ css.recoverySpinner } />
                    <FlexRow padding="24" cx={ css.recoveryMessage }>
                        <FlexCell grow={ 1 }>
                            <RichTextView>{subtitle}</RichTextView>
                        </FlexCell>
                    </FlexRow>
                </ModalWindow>
            </ModalBlocker>
        );
    };

    const renderErrorPage = (errorInfo: UuiErrorInfo) => {
        return <ErrorPage cx={ props.cx } { ...errorInfo } />;
    };

    if (errorType == 'error') {
        uuiModals.closeAll();
        return renderErrorPage(errorInfo as UuiErrorInfo);
    }

    if (errorType == 'notification') {
        showNotifications(errorInfo as ApiCallInfo[]);
    }

    return (
        <ErrorCatch>
            {props.children}
            {errorType == 'recovery' && renderRecoveryBlocker(errorInfo as UuiRecoveryErrorInfo)}
        </ErrorCatch>
    );
};
