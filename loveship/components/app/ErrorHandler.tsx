import React from 'react';
import { ApiCallInfo, IHasCX, useUuiContext, useUuiError, UuiErrorInfo, UuiRecoveryErrorInfo, IHasChildren, ApiRecoveryReason, ApiCallErrorType } from '@epam/uui-core';
import { ModalBlocker, ModalHeader } from '@epam/uui';
import { ModalWindow } from '../../components/overlays';
import { FlexRow } from '../layout';
import { Text } from '../typography';
import { RichTextView, FlexCell, Spinner, ErrorNotification } from '@epam/uui';
import { ErrorCatch } from '@epam/uui-components';
import { ErrorPage } from './ErrorPage';
import css from './ErrorHandler.module.scss';

type Theme = 'light' | 'dark';

const imageUrl = {
    light: {
        404: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages/error-404.svg',
        403: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages/error-403.svg',
        500: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages/error-500.svg',
        502: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages/error-502.svg',
    },
    dark: {
        404: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages/error-404-dark.svg',
        403: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages/error-403-dark.svg',
        500: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages/error-500-dark.svg',
        502: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages/error-502-dark.svg',
    },
};

export const recoveryWordings: Record<ApiRecoveryReason, { title: string; subtitle: string }> = {
    'auth-lost': {
        title: 'Your session has expired.',
        subtitle: 'Attempting to log you in.',
    },
    'connection-lost': {
        title: 'Network connection down',
        subtitle: 'Please check your network connection.',
    },
    maintenance: {
        title: 'Server maintenance',
        subtitle: 'We apologize for the inconvenience. Our site is currently under maintenance. Will come back as soon as possible.',
    },
    'server-overload': {
        title: 'Server overloaded',
        subtitle: 'We are trying to recover. Please wait.',
    },
};

export const getDefaultErrorPageProps = (theme: Theme = 'light'): Record<ApiCallErrorType, UuiErrorInfo> => {
    return {
        notFound: {
            imageUrl: imageUrl[theme][404],
            title: 'Oooops! We couldn’t find this page',
            subtitle: 'Sorry for the inconvenience.',
        },
        permissionDenied: {
            imageUrl: imageUrl[theme][403],
            title: 'You have no permissions!',
            subtitle: 'Sorry for the inconvenience.',
        },
        serverError: {
            imageUrl: imageUrl[theme][500],
            title: '500 Error! Something went wrong',
            subtitle: 'Sorry for the inconvenience, we’ll get it fixed.',
        },
        serviceUnavailable: {
            imageUrl: imageUrl[theme][502],
            title: 'The page request was canceled, because it took too long to complete',
            subtitle: 'Sorry for the inconvenience, we’ll get it fixed.',
        },
        default: {
            imageUrl: imageUrl[theme][500],
            title: 'Something went wrong',
            subtitle: 'Sorry for the inconvenience, we’ll get it fixed.',
        },
    };
};

export interface ErrorConfig {
    getInfo?: (error: any, defaultErrorInfo: UuiErrorInfo) => UuiErrorInfo;
}

export interface ErrorPageProps extends IHasCX, IHasChildren {
    errorPageConfig?: ErrorConfig;
    theme?: Theme;
    onNotificationError?: (errors: ApiCallInfo) => void;
}

export function ErrorHandler(props: ErrorPageProps) {
    const { uuiNotifications, uuiModals } = useUuiContext();
    const { errorType, errorInfo } = useUuiError({
        getErrorInfo: props.errorPageConfig?.getInfo,
        options: {
            errorConfig: getDefaultErrorPageProps(props.theme),
            recoveryConfig: recoveryWordings,
        },
    });

    const showNotifications = (errors: ApiCallInfo[]) => {
        errors.forEach((c) => {
            if (props.onNotificationError) {
                props.onNotificationError(c);
            } else {
                uuiNotifications.show((notificationProps) => (
                    <ErrorNotification { ...notificationProps }>
                        <Text size="36">
                            {c.responseData && c.responseData.errorMessage}
                        </Text>
                    </ErrorNotification>
                ));
            }
            c.dismissError();
        });
    };

    const renderRecoveryBlocker = (errorInformation: UuiRecoveryErrorInfo) => {
        return (
            <ModalBlocker cx={ css.modalBlocker } key="auth-lost" isActive={ true } zIndex={ 100500 } success={ () => {} } abort={ () => {} }>
                <ModalWindow>
                    <ModalHeader borderBottom title={ errorInformation.title } />
                    <Spinner cx={ css.recoverySpinner } />
                    <FlexRow padding="24" cx={ css.recoveryMessage }>
                        <FlexCell grow={ 1 }>
                            <RichTextView>{errorInformation.subtitle}</RichTextView>
                        </FlexCell>
                    </FlexRow>
                </ModalWindow>
            </ModalBlocker>
        );
    };

    const renderErrorPage = (errorInformation: UuiErrorInfo) => {
        return <ErrorPage cx={ props.cx } theme={ props.theme } { ...errorInformation } />;
    };

    if (errorType === 'error') {
        uuiModals.closeAll();
        return renderErrorPage(errorInfo as UuiErrorInfo);
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
