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
    const processRequestLocal = <ResponseData = unknown>(
        // Rest operator is used to avoid duplicating parameters of `IProcessRequest` function.
        ...requestParams: Parameters<IProcessRequest<ResponseData>>
    ) => {
        return processRequest(...requestParams) as Promise<ResponseData>;
    };

    return {
        demo: getDemoApi(processRequestLocal, origin),
        success: {
            validateForm: <FormState, ResponseData>(formState: FormState) =>
                processRequestLocal<ResponseData>(
                    origin.concat('api/success/validate-form'),
                    'POST',
                    formState
                ),
        },
        errors: {
            status: (status: number) =>
                processRequestLocal(
                    origin.concat(`api/error/status/${status}`),
                    'POST'
                ),
            setServerStatus: (status: number) =>
                processRequestLocal(
                    origin.concat(`api//error/set-server-status/${status}`),
                    'POST'
                ),
            mock: () => processRequestLocal(origin.concat(`api//error/mock`), 'GET'),
            authLost: () =>
                processRequestLocal(origin.concat(`api//error/auth-lost`), 'POST'),
        },
        getChangelog() {
            return processRequestLocal<any>(origin.concat('/api/get-changelog'), 'GET');
        },
        getCode(rq: GetCodeParams) {
            return processRequestLocal<GetCodeResponse>(origin.concat(`/api/get-code`), 'POST', rq);
        },
        getProps() {
            return processRequestLocal<any>(origin.concat(`/api/get-props/`), 'GET');
        },
    };
}

export type TApi = ReturnType<typeof apiDefinition>;
