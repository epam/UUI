import { useEffect } from 'react';
import { useUuiContext } from '../services';
import { ApiCallInfo, ApiRecoveryReason, UuiError, UuiErrorInfo } from '../types';
import { useForceUpdate } from './useForceUpdate';

export type UuiErrorType = 'error' | 'notification' | 'recovery';

export type UuiRecoveryErrorInfo = {
    title: string,
    subtitle: string,
};

export interface UseUuiErrorOptions {
    errorConfig: Record<string, UuiErrorInfo>;
    recoveryConfig: Record<ApiRecoveryReason, UuiRecoveryErrorInfo>;
}

export interface UseUuiErrorProps {
    customErrorHandler: (error: Error | UuiError | ApiCallInfo, defaultErrorInfo: UuiErrorInfo) => UuiErrorInfo;
    options: UseUuiErrorOptions;
}

export const useUuiError = (props: UseUuiErrorProps) => {
    const forceUpdate = useForceUpdate();
    const { uuiApi, uuiErrors, uuiRouter } = useUuiContext();
    const { customErrorHandler, options: { errorConfig, recoveryConfig } } = props;
    const apiErrors: ApiCallInfo[] = [];
    const apiNotifications: ApiCallInfo[] = [];

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
            case 403: return errorConfig.permissionDenied;
            case 404: return errorConfig.notFound;
            case 500: return errorConfig.serverError;
            case 503: return errorConfig.serviceUnavailable;
            default: return errorConfig.default;
        }
    };

    const getError = (error: Error | UuiError | ApiCallInfo, errorInfo: UuiErrorInfo) => {
        const resultError = customErrorHandler ? customErrorHandler(error, errorInfo) : errorInfo;
        return { errorType: 'error', errorInfo: resultError };
    };

    uuiApi.getActiveCalls().forEach(c => {
        if (c.status === 'error' && c.options.errorHandling === 'page') {
            apiErrors.push(c);
        } else if (c.options.errorHandling === 'notification') {
            apiNotifications.push(c);
        }
    });

    if (apiErrors.length) {
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
        const defaultErrorInfo =  getDefaultErrorInfo(status);

        return getError(error, { ...defaultErrorInfo, ...info });
    } else {
        return { errorType: undefined, errorInfo: undefined };
    }
};