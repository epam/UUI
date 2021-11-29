import { useEffect } from 'react';
import { useUuiContext } from '../services';
import { ApiCallInfo, ApiRecoveryReason, UuiError, UuiErrorInfo } from '../types';
import { useForceUpdate } from './useForceUpdate';

export type UuiErrorType = 'error' | 'notification' | 'recovery';

export type UUIRecoveryErrorInfo = {
    title: string,
    subtitle: string,
};

export interface UseUUIErrorOptions {
    error: Record<string, UuiErrorInfo>;
    recovery: Record<ApiRecoveryReason, UUIRecoveryErrorInfo>;
}

export interface UseUUIErrorProps {
    customErrorHandler: (error: Error | UuiError | ApiCallInfo, defaultErrorInfo: UuiErrorInfo) => UuiErrorInfo;
    options: UseUUIErrorOptions;
}

export const useUUIError = (props: UseUUIErrorProps) => {
    const forceUpdate = useForceUpdate();
    const { uuiApi, uuiErrors, uuiRouter } = useUuiContext();
    const { customErrorHandler, options: { error, recovery } } = props;
    const apiErrors: ApiCallInfo[] = [];
    const apiNotifications: ApiCallInfo[] = [];
    let resultError;

    const onRouteChange = () => {
        let hasError = false;
        if (uuiApi.getActiveCalls().some(c => c.status === 'error')) {
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
        uuiRouter.listen(onRouteChange);
        uuiErrors.subscribe(() => forceUpdate());
    }, []);

    const getDefaultErrorInfo = (errorCode: number): UuiErrorInfo => {
        switch (errorCode) {
            case 403: return error.permissionDenied;
            case 404: return error.notFound;
            case 500: return error.serverError;
            case 503: return error.serviceUnavailable;
            default: return error.default;
        }
    };

    uuiApi.getActiveCalls().forEach(c => {
        if (c.status === 'error' && c.options.errorHandling === 'page') {
            apiErrors.push(c);
        } else if (c.options.errorHandling === 'notification') {
            apiNotifications.push(c);
        }
    });

    if (apiErrors.length) {
        const defaultErrorInfo =  getDefaultErrorInfo(apiErrors[0].httpStatus);

        if (customErrorHandler) {
            resultError = customErrorHandler(apiErrors[0], defaultErrorInfo);
        } else {
            resultError = defaultErrorInfo;
        }

        return { errorType: 'error', errorInfo: resultError };
    } else if (apiNotifications.length) {
        return { errorType: 'notification', errorInfo: apiNotifications };
    } else if (uuiApi.status === 'recovery') {
        return { errorType: 'recovery', errorInfo: recovery[uuiApi.recoveryReason] };
    } else if (uuiErrors.currentError != null) {
        const error = uuiErrors.currentError;
        let status;
        let info = {};

        if (error instanceof UuiError) {
            status = error.info.status;
            info = error.info;
        }
        const defaultErrorInfo =  getDefaultErrorInfo(status);
        let resultError;

        if (customErrorHandler) {
            resultError = customErrorHandler(error, { ...defaultErrorInfo, ...info });
        } else {
            resultError = { ...defaultErrorInfo, ...info };
        }

        return { errorType: 'error', errorInfo: resultError };
    } else {
        return { errorType: undefined, errorInfo: undefined };
    }
};