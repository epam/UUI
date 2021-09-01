import { getDemoApi } from "@epam/uui-docs";
import type { ApiCallOptions, CommonContexts, UuiContexts } from "@epam/uui";

export interface GetCodeParams {
    path: string;
}

export interface GetCodeResponse {
    filePath: string;
    gitUrl: string;
    raw: string;
    highlighted: string;
}

export function getApi(processRequest: (request: string, requestMethod: string, data?: any, options?: ApiCallOptions) => any) {
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
        getChangelog(): Promise<any> {
            return processRequest('/api/get-changelog', 'GET');
        },
        getCode(rq: GetCodeParams): Promise<GetCodeResponse> {
            return processRequest(`/api/get-code`, 'POST', rq);
        },
        getProps(): Promise<any> {
            return processRequest(`/api/get-props/`, 'GET');
        },
    };
}

export type TApi = ReturnType<typeof getApi>;
export const svc: Partial<CommonContexts<TApi, UuiContexts>> = {};