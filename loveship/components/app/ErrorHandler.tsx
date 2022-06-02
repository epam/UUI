import React, { FC } from 'react';
import { ApiCallInfo, IHasCX, useUuiContext, useUuiError, UuiErrorInfo, UuiRecoveryErrorInfo, IHasChildren,
    ApiRecoveryReason, ApiCallErrorType } from '@epam/uui-core';
import { ModalBlocker, ModalHeader, ModalWindow, SnackbarCard } from '../overlays';
import { FlexCell, FlexRow } from '../layout';
import { RichTextView, Text } from '../typography';
import { Spinner } from '../widgets';
import { ErrorCatch } from '@epam/uui-components';
import { ErrorPage } from './ErrorPage';
import * as css from './ErrorHandler.scss';

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

const defaultNotificationErrorMessage = `Sorry, there's a temporary problem. Please try again in a few moments`;

export const recoveryConfig: Record<ApiRecoveryReason, { title: string, subtitle: string }> = {
    'auth-lost': {
        title: 'Your session has expired.',
        subtitle: 'Attempting to log you in.',
    },
    'connection-lost': {
        title: 'Network connection down',
        subtitle: 'Please check your network connection.',
    },
    'maintenance': {
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
            title: "Oooops! We couldn’t find this page",
            subtitle: "Sorry for the inconvenience.",
        },
        permissionDenied: {
            imageUrl: imageUrl[theme][403],
            title: "You have no permissions!",
            subtitle: "Sorry for the inconvenience.",
        },
        serverError: {
            imageUrl: imageUrl[theme][500],
            title: "500 Error! Something went wrong",
            subtitle: "Sorry for the inconvenience, we’ll get it fixed.",
        },
        serviceUnavailable: {
            imageUrl:imageUrl[theme][502],
            title: "The page request was canceled, because it took too long to complete",
            subtitle: "Sorry for the inconvenience, we’ll get it fixed.",
        },
        default: {
            imageUrl: imageUrl[theme][500],
            title: "Something went wrong",
            subtitle: "Sorry for the inconvenience, we’ll get it fixed.",
        },
    };
};

export interface ErrorConfig {
    getInfo?: (error: any, defaultErrorInfo: UuiErrorInfo) => UuiErrorInfo;
}

export interface ErrorPageProps extends IHasCX, IHasChildren {
    errorPageConfig?: ErrorConfig;
    theme?: Theme;
}

export const ErrorHandler: FC<ErrorPageProps> = (props) => {
    const { uuiNotifications, uuiModals } = useUuiContext();
    const { errorType, errorInfo } = useUuiError({
        getErrorInfo: props.errorPageConfig?.getInfo,
        options: {
            errorConfig: getDefaultErrorPageProps(props.theme),
            recoveryConfig: recoveryConfig,
        },
    });


    const showNotifications = (errors: ApiCallInfo[]) => {
        errors.forEach(c => {
            uuiNotifications.show(props =>
                <SnackbarCard { ...props } snackType='danger'>
                    <FlexRow padding='24' vPadding='12'>
                        <Text size='36'>{ (c.responseData?.errorMessage) || defaultNotificationErrorMessage }</Text>
                    </FlexRow>
                </SnackbarCard>,
            );
            c.dismissError();
        });
    };

    const renderRecoveryBlocker = (errorInfo: UuiRecoveryErrorInfo) => {
        return (
            <ModalBlocker cx={ css.modalBlocker } blockerShadow='dark' key='auth-lost' isActive={ true } zIndex={ 100500 } success={ () => { } } abort={ () => { } }>
                <ModalWindow>
                    <ModalHeader borderBottom title={ errorInfo.title } />
                    <Spinner cx={ css.recoverySpinner } color='fire' />
                    <FlexRow padding='24' cx={ css.recoveryMessage }>
                        <FlexCell grow={ 1 }>
                            <RichTextView>{ errorInfo.subtitle }</RichTextView>
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

    return <ErrorCatch>
        { props.children }
        { errorType == 'recovery' && renderRecoveryBlocker(errorInfo as UuiRecoveryErrorInfo) }
    </ErrorCatch>;
};