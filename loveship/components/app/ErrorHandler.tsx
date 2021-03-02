import React from 'react';
import { UuiContexts, uuiContextTypes, ApiRecoveryReason, INotification, UuiError, UuiErrorInfo, IHasCX } from '@epam/uui';
import { ModalBlocker, ModalWindow, ModalHeader, SnackbarCard } from './../overlays';
import { FlexRow, FlexCell } from './../layout';
import { RichTextView, Text } from './../typography';
import { Spinner } from './../widgets';
import { ErrorPage } from './ErrorPage';
import * as css from './ErrorHandler.scss';

type Theme = 'light' | 'dark';

export interface ErrorConfig {
    getAction?: (errorCode: number) => JSX.Element;
    getInfo?: (errorCode: number) => UuiErrorInfo;
}

export interface ErrorPageProps extends IHasCX {
    errorPageConfig?: ErrorConfig;
    theme?: Theme;
}


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

export const getDefaultErrorPageProps = (theme: Theme = 'light'): Record<string, UuiErrorInfo> => {
    const defaultErrorPageProps: Record<string, UuiErrorInfo> = {
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
        badGateway: {
            imageUrl: imageUrl[theme][502],
            title: "502 Error! The server encountered a temporary error and could not complete your request.",
            subtitle: "Sorry for the inconvenience, we’ll get it fixed.",
        },
        serviceUnavailable: {
            imageUrl:imageUrl[theme][502],
            title: "The page request was canceled, because it took too long to complete",
            subtitle: "Sorry for the inconvenience, we’ll get it fixed.",
        },
        somethingWentWrong: {
            imageUrl: imageUrl[theme][500],
            title: "Something went wrong",
            subtitle: "Sorry for the inconvenience, we’ll get it fixed.",
        },
    };

    return defaultErrorPageProps;
};

export const recoveryWordings: Record<ApiRecoveryReason, { title: string, text: string }> = {
    'auth-lost': {
        title: 'Your session has expired.',
        text: 'Attempting to log you in.',
    },
    'connection-lost': {
        title: 'Network connection down',
        text: 'Please check your network connection.',
    },
    'maintenance': {
        title: 'Server maintenance',
        text: 'We apologize for the inconvenience. Our site is currently under maintenance. Will come back as soon as possible.',
    },
    'server-overload': {
        title: 'Server overloaded',
        text: 'We are trying to recover. Please wait.',
    },
};

const defaultNotificationErrorMessage = `Sorry, there's a temporary problem. Please try again in a few moments`;

export class ErrorHandler extends React.Component<ErrorPageProps> {
    static contextTypes = uuiContextTypes;
    public context: UuiContexts;
    public state: { jsError: Error, jsErrorInfo: React.ErrorInfo } = { jsError: null, jsErrorInfo: null };

    defaultErrorPageProps = getDefaultErrorPageProps(this.props?.theme);

    onApiChange = () => {
        this.context.uuiApi.getActiveCalls()
            .filter(c => c.options.errorHandling === 'notification')
            .forEach(c => {
                this.context.uuiNotifications.show((props: INotification) =>
                    <SnackbarCard { ...props } snackType='danger'>
                        <FlexRow padding='24' vPadding='12'>
                            <Text size="36">{ (c.responseData && c.responseData.errorMessage) || defaultNotificationErrorMessage }</Text>
                        </FlexRow>
                    </SnackbarCard>,
                );
                c.dismissError();
            });
        this.forceUpdate();
    }

    constructor(props: ErrorPageProps, context: UuiContexts) {
        super(props, context);
        context.uuiApi.subscribe(this.onApiChange);
        context.uuiErrors.onError(() => this.forceUpdate());
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.context.uuiErrors.reportError(error);
    }

    getDefaultInfo = (errorCode: number): UuiErrorInfo => {
        switch (errorCode) {
            case 404: return this.defaultErrorPageProps.notFound;
            case 403: return this.defaultErrorPageProps.permissionDenied;
            case 500: return this.defaultErrorPageProps.serverError;
            case 502: return this.defaultErrorPageProps.badGateway;
            case 503: return this.defaultErrorPageProps.serviceUnavailable;
            default: return this.defaultErrorPageProps.somethingWentWrong;
        }
    }


    renderErrorPage(errorCode: number, customInfo?: UuiErrorInfo) {
        let getInfo = (this.props.errorPageConfig && this.props.errorPageConfig.getInfo) || this.getDefaultInfo;
        let pageInfo = getInfo(errorCode);

        if (customInfo) {
            pageInfo = { ...pageInfo, ...customInfo };
        }

        return <ErrorPage theme={ this.props?.theme } cx={ this.props.cx } { ...pageInfo } />;
    }

    render() {
        let page: any = null;
        let firstCallWithError = this.context.uuiApi.getActiveCalls().filter(c => c.status === 'error' && c.options.errorHandling === 'page')[0];
        if (this.context.uuiErrors.currentError != null) {
            const error = this.context.uuiErrors.currentError;
            let status;
            let info: UuiErrorInfo = {};
            if (error instanceof UuiError) {
                status = error.info?.status;
                info = error.info;
            }

            page = this.renderErrorPage(status, info);
            this.context.uuiModals.closeAll();
        } else if (firstCallWithError != null) {
            page = this.renderErrorPage(firstCallWithError.httpStatus);
            this.context.uuiModals.closeAll();
        } else {
            page = this.props.children;
        }

        let recoveryMessage = this.context.uuiApi.status === 'recovery' && recoveryWordings[this.context.uuiApi.recoveryReason];

        const blocker = recoveryMessage && (
            <ModalBlocker cx={ css.modalBlocker } blockerShadow='dark' key='auth-lost' isActive={ true } zIndex={ 100500 } success={ () => { } } abort={ () => { } }>
                <ModalWindow>
                    <ModalHeader borderBottom title={ recoveryMessage.title } />
                    <Spinner cx={ css.recoverySpinner } color='fire' />
                    <FlexRow padding='24' cx={ css.recoveryMessage }>
                        <FlexCell grow={ 1 }>
                            <RichTextView>{ recoveryMessage.text }</RichTextView>
                        </FlexCell>
                    </FlexRow>
                </ModalWindow>
            </ModalBlocker>
        );

        return <>
            { page }
            { blocker }
        </>;
    }

}