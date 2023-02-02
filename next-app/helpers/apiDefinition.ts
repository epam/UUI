import { getDemoApi } from "@epam/uui-docs";
import type { ApiCallOptions } from "@epam/uui-core";

export interface GetCodeParams {
    path: string;
}

export interface GetCodeResponse {
    filePath: string;
    gitUrl: string;
    raw: string;
    highlighted: string;
}

export function apiDefinition(processRequest: (request: string, requestMethod: string, data?: any, options?: ApiCallOptions) => any, origin: string = '') {
    return {
        demo: getDemoApi(processRequest, origin),
        success: {
            validateForm: <T>(formState: T) => processRequest(origin.concat('api/success/validate-form'), 'POST', formState),
        },
        errors: {
            status: (status: number) => processRequest(origin.concat(`api/error/status/${status}`), 'POST'),
            setServerStatus: (status: number) => processRequest(origin.concat(`api//error/set-server-status/${status}`), 'POST'),
            mock: () => processRequest(origin.concat(`api//error/mock`), 'GET'),
            authLost: () => processRequest(origin.concat(`api//error/auth-lost`), 'POST'),
        },
        getChangelog(): Promise<any> {
            return processRequest(origin.concat('/api/get-changelog'), 'GET');
        },
        getCode(rq: GetCodeParams): Promise<GetCodeResponse> {
            return processRequest(origin.concat(`/api/get-code`), 'POST', rq);
        },
        getProps(): Promise<any> {
            return processRequest(origin.concat(`/api/get-props/`), 'GET');
        },
    };
}

export type TApi = ReturnType<typeof apiDefinition>;
