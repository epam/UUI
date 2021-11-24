import React, { useEffect, useState } from 'react';
import { useUuiContext } from '../services';
import { ApiCallInfo, ApiRecoveryReason, UuiError, UuiErrorInfo } from '../types';

export type UuiErrorType = 'error' | 'notification' | 'recovery';

export type UUIRecoveryErrorInfo = {
    title: string,
    text: string,
};

export const useUUIError = (customErrorHandler: (error: Error | UuiError | ApiCallInfo, defaultErrorInfo: UuiErrorInfo) => UuiErrorInfo, options: { error: Record<string, UuiErrorInfo>, notification: string, recovery: Record<ApiRecoveryReason, UUIRecoveryErrorInfo> }) => {
    const [, updateState] = React.useState<object>();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [errorType, setErrorType] = useState<UuiErrorType>();
    const [errorInfo, setErrorInfo] = useState<UuiErrorInfo | ApiCallInfo[]>();
    const { uuiApi, uuiErrors, uuiRouter } = useUuiContext();
    const { error, recovery, notification } = options;

    useEffect(() => {
        uuiApi.subscribe(onApiChange);
        uuiRouter.listen(onRouteChange);
    }, []);

    const onApiChange = () => {
        const apiErrors: ApiCallInfo[] = [];
        const apiNotifications: ApiCallInfo[] = [];
        uuiApi.getActiveCalls().forEach(c => {
            if (c.status === 'error' && c.options.errorHandling === 'page') {
                apiErrors.push(c);
            } else if (c.options.errorHandling === 'notification') {
                apiNotifications.push(c?.responseData?.errorMessage ? c : { ...c, responseData: { errorMessage: notification } });
            }
        });

        if (apiErrors.length) {
            const defaultErrorInfo =  getDefaultErrorInfo(apiErrors[0].httpStatus);
            let resultError;

            if (customErrorHandler) {
                resultError = customErrorHandler(apiErrors[0], defaultErrorInfo);
            } else {
                resultError = defaultErrorInfo;
            }

            setErrorType('error');
            setErrorInfo(resultError);
        } else if (apiNotifications.length) {
            setErrorType('notification');
            setErrorInfo(apiNotifications);
        } else if (uuiApi.status === 'recovery') {
            setErrorType('recovery');
            setErrorInfo(recovery[uuiApi.recoveryReason]);
        } else {
            setErrorType(undefined);
            setErrorInfo(undefined);
        }
    };

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

    const getDefaultErrorInfo = (errorCode: number): UuiErrorInfo => {
        switch (errorCode) {
            case 403: return error.permissionDenied;
            case 404: return error.notFound;
            case 500: return error.serverError;
            case 503: return error.serviceUnavailable;
            default: return error.default;
        }
    };

    if (uuiErrors.currentError != null) {
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

        return {
            errorType: 'error',
            errorInfo: resultError,
        };
    } else if (uuiApi.status === 'recovery') {
        return {
            errorType: 'recovery',
            errorInfo: recovery[uuiApi.recoveryReason],
        };
    }

    return {
        errorType,
        errorInfo,
    };
};