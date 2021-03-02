import { getDemoApi } from "@epam/uui-docs";

export interface GetCodeParams {
    path: string;
}

export interface GetCodeResponse {
    filePath: string;
    gitUrl: string;
    raw: string;
    highlighted: string;
}

export function getApi(processRequest: (request: string, requestMethod: string, data?: any, options?: RequestInit) => any) {
    return {
        demo: getDemoApi(processRequest),
        success: {
            validateForm: <T>(formState: T) => processRequest('api/success/validate-form', 'POST', formState),
        },
        errors: {
            status: (status: number) => processRequest(`api/error/status/${status}`, 'POST'),
            setServerStatus: (status: number) => processRequest(`api//error/set-server-status/${status}`, 'POST'),
            mock: () => processRequest(`api//error/mock`, 'GET'),
            authLost: () => processRequest(`api//error/auth-lost`, 'POST'),
        },
        getChangelog: function (): Promise<any> {
            return processRequest('/api/get-changelog', 'GET');
        },
        getCode: function (rq: GetCodeParams): Promise<GetCodeResponse> {
            return processRequest(`/api/get-code`, 'POST', rq);
        },
        getProps: function (): Promise<any> {
            return processRequest(`/api/get-props/`, 'GET');
        },
    };
}