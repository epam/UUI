import { getDemoApi } from '@epam/uui-docs';
import type {
    IProcessRequest, CommonContexts, UuiContexts, ITablePreset,
} from '@epam/uui-core';
import { TType, TTypeRef } from '@epam/uui-docs';
import { TDocsGenTypeSummary } from '../common/apiReference/types';
import { IUuiTokensCollection } from '../sandbox/tokens/palette/types/sharedTypes';

export const delay = (ms: number = 1): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

export interface GetCodeParams {
    path: string;
}

export interface GetCodeResponse {
    filePath: string;
    gitUrl: string;
    raw: string;
    highlighted: string;
}

export function getApi(params: { processRequest: IProcessRequest, origin?: string, fetchOptions?: RequestInit }) {
    const { origin = '', fetchOptions } = params;

    const processRequest: IProcessRequest = (url, method, data, options) => {
        const opts = fetchOptions ? { fetchOptions, ...options } : options;
        return params.processRequest(url, method, data, opts);
    };

    return {
        demo: getDemoApi(processRequest, origin),
        form: {
            validateForm: <T>(formState: T) => processRequest(origin.concat('api/form/validate-form'), 'POST', formState),
        },
        errors: {
            status: (status: number) => processRequest(origin.concat(`api/error/status/${status}`), 'POST'),
            setServerStatus: (status: number) => processRequest(origin.concat(`api//error/set-server-status/${status}`), "'POST'"),
            mock: () => processRequest(origin.concat('api/error/mock'), 'GET'),
            authLost: () => processRequest(origin.concat('api/error/auth-lost'), 'POST'),
        },
        getChangelog(): Promise<any> {
            return processRequest(origin.concat('/api/get-changelog'), 'GET');
        },
        getCode(rq: GetCodeParams): Promise<GetCodeResponse> {
            return processRequest(origin.concat('/api/get-code'), 'POST', rq);
        },
        getProps(): Promise<any> {
            return processRequest(origin.concat('/api/get-props/'), 'GET');
        },
        getDocsGenType(shortRef: TTypeRef): Promise<{ content: TType }> {
            const refEncoded = encodeURIComponent(shortRef);
            return processRequest(origin.concat(`/api/docs-gen/details/${refEncoded}`), 'GET');
        },
        getDocsGenSummaries(): Promise<{ content: TDocsGenTypeSummary }> {
            return processRequest(origin.concat('/api/docs-gen/summaries'), 'GET');
        },
        getDocsGenExports(): Promise<{ content: Record<string, string[]> }> {
            return processRequest(origin.concat('/api/docs-gen/exports'), 'GET');
        },
        getThemeTokens(): Promise<{ content: IUuiTokensCollection['exposedTokens'] }> {
            return processRequest(origin.concat('/api/theme-tokens'), 'GET');
        },
        presets: {
            async getPresets(): Promise<ITablePreset[]> {
                await delay(500);
                return Promise.resolve(JSON.parse(localStorage.getItem('presets')) ?? []);
            },
            async createPreset(preset: ITablePreset): Promise<number> {
                await delay(500);
                const presets = (JSON.parse(localStorage.getItem('presets')) ?? []) as ITablePreset[];
                const newId = presets.length
                    ? Math.max.apply(
                        null,
                        presets.map((p) => p.id),
                    ) + 1
                    : 1;
                preset.id = newId;
                localStorage.setItem('presets', JSON.stringify([...presets, preset]));
                return Promise.resolve(newId);
            },
            async updatePreset(preset: ITablePreset): Promise<void> {
                await delay(500);
                const presets = (JSON.parse(localStorage.getItem('presets')) ?? []) as ITablePreset[];
                presets.splice(
                    presets.findIndex((p) => p.id === preset.id),
                    1,
                    preset,
                );
                localStorage.setItem('presets', JSON.stringify(presets));
                return Promise.resolve();
            },
            async deletePreset(preset: ITablePreset): Promise<void> {
                await delay(500);
                const presets = (JSON.parse(localStorage.getItem('presets')) ?? []) as ITablePreset[];
                presets.splice(
                    presets.findIndex((p) => p.id === preset.id),
                    1,
                );
                localStorage.setItem('presets', JSON.stringify(presets));
                return Promise.resolve();
            },
        },
    };
}

export type TApi = ReturnType<typeof getApi>;
export const svc: Partial<CommonContexts<TApi, UuiContexts>> = {};
