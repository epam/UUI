import { getDemoApi } from '@epam/uui-docs';
import type { IProcessRequest } from '@epam/uui-core';

export interface GetCodeParams {
    path: string;
}

export interface GetCodeResponse {
    filePath: string;
    gitUrl: string;
    raw: string;
    highlighted: string;
}

export function apiDefinition(
    processRequest: IProcessRequest,
    origin: string = ''
) {
    return {
        demo: getDemoApi(processRequest, origin),
        success: {
            validateForm: <FormState>(formState: FormState) =>
                processRequest(
                    origin.concat('api/success/validate-form'),
                    'POST',
                    formState
                ),
        },
        errors: {
            status: (status: number) =>
                processRequest(
                    origin.concat(`api/error/status/${status}`),
                    'POST'
                ),
            setServerStatus: (status: number) =>
                processRequest(
                    origin.concat(`api//error/set-server-status/${status}`),
                    'POST'
                ),
            mock: () => processRequest(origin.concat(`api//error/mock`), 'GET'),
            authLost: () =>
                processRequest(origin.concat(`api//error/auth-lost`), 'POST'),
        },
        getChangelog() {
            return processRequest(origin.concat('/api/get-changelog'), 'GET');
        },
        getCode(rq: GetCodeParams) {
            return processRequest<GetCodeResponse>(origin.concat(`/api/get-code`), 'POST', rq);
        },
        getProps() {
            return processRequest(origin.concat(`/api/get-props/`), 'GET');
        },
    };
}

export type TApi = ReturnType<typeof apiDefinition>;
