import { useEffect } from 'react';
import { useUuiContext, UuiError, ErrorPageInfo } from '../services';
import {
    ApiCallInfo, ApiRecoveryReason,
} from '../types';
import { useForceUpdate } from './useForceUpdate';
import { isClientSide } from '../helpers/ssr';

export type UuiRecoveryErrorInfo = {
    title: string;
    subtitle: string;
};

export type ApiCallErrorType = 'permissionDenied' | 'notFound' | 'serverError' | 'serviceUnavailable' | 'default';

export interface UseUuiErrorOptions {
    /** Config with information which data will be displayed in case of particular API error.
     * If omitted, default config will be used.
     * */
    errorConfig?: Record<ApiCallErrorType, ErrorPageInfo>;
    /** Config with information which data will be displayed in case recovery errors.
     * If omitted, default config will be used.
     * */
    recoveryConfig?: Record<ApiRecoveryReason, UuiRecoveryErrorInfo>;
}

export interface UseUuiErrorProps {
    /** Pure function to get error info for display based on error.
     * If omitted, error info from default config or options.errorConfig will be used.
     */
    getErrorInfo: (error: any, defaultErrorInfo: ErrorPageInfo) => ErrorPageInfo;
    /** Error handling options */
    options?: UseUuiErrorOptions;
}

export const useUuiError = (props: UseUuiErrorProps) => {
    const forceUpdate = useForceUpdate();
    const {
        uuiApi, uuiErrors, uuiRouter, uuiModals,
    } = useUuiContext();
    const { getErrorInfo, options: { errorConfig, recoveryConfig } = {} } = props;
    const apiErrors: ApiCallInfo[] = [];
    const apiNotifications: ApiCallInfo[] = [];

    const onRouteChange = () => {
        let hasError = false;
        if (uuiApi.getActiveCalls().some((c) => c.status === 'error')) {
            uuiApi.reset();
            hasError = true;
        }

        if (uuiErrors.currentError !== null) {
            uuiErrors.recover();
            hasError = true;
        }

        hasError && forceUpdate();
    };

    useEffect(() => {
        let routerUnsubscribe: () => void;
        if (isClientSide) {
            routerUnsubscribe = uuiRouter.listen(onRouteChange);
        }
        uuiApi.subscribe(forceUpdate);
        uuiErrors.subscribe(forceUpdate);

        return () => {
            uuiApi.unsubscribe(forceUpdate);
            uuiErrors.unsubscribe(forceUpdate);
            routerUnsubscribe?.();
        };
    }, []);

    const getDefaultErrorInfo = (errorCode: number): ErrorPageInfo => {
        switch (errorCode) {
            case 403:
                return errorConfig?.permissionDenied;
            case 404:
                return errorConfig?.notFound;
            case 500:
                return errorConfig?.serverError;
            case 503:
                return errorConfig?.serviceUnavailable;
            default:
                return errorConfig?.default;
        }
    };

    const getError = (error: any, errorInfo: ErrorPageInfo) => {
        const resultError = getErrorInfo ? getErrorInfo(error, errorInfo) : errorInfo;
        return { errorType: 'error', errorInfo: resultError };
    };

    uuiApi.getActiveCalls().forEach((c) => {
        if (c.status === 'error' && c.options.errorHandling === 'page') {
            apiErrors.push(c);
        } else if (c.status === 'error' && c.options.errorHandling === 'notification') {
            apiNotifications.push(c);
        }
    });

    if (apiErrors.length) {
        uuiModals.closeAll();
        return getError(apiErrors[0], getDefaultErrorInfo(apiErrors[0].httpStatus));
    } else if (apiNotifications.length) {
        return { errorType: 'notification', errorInfo: apiNotifications };
    } else if (uuiApi.status === 'recovery') {
        return { errorType: 'recovery', errorInfo: recoveryConfig[uuiApi.recoveryReason] };
    } else if (uuiErrors.currentError != null) {
        const error = uuiErrors.currentError;
        let status;
        let info = {};

        if (error instanceof UuiError) {
            status = error.info.status;
            info = error.info;
        }
        const defaultErrorInfo = getDefaultErrorInfo(status);

        return getError(error, { ...defaultErrorInfo, ...info });
    } else {
        return { errorType: undefined, errorInfo: undefined };
    }
};
