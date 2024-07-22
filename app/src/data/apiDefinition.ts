import { getDemoApi } from '@epam/uui-docs';
import type {
    CommonContexts, UuiContexts, ITablePreset, IProcessRequest,
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

interface GetApiParams {
    processRequest: IProcessRequest;
    origin?: string;
    fetchOptions?: RequestInit;
}

export function getApi({
    processRequest,
    origin = '',
    fetchOptions,
} : GetApiParams) {
    const processRequestLocal: IProcessRequest = (url, method, data, options) => {
        const opts = fetchOptions ? { fetchOptions, ...options } : options;
        return processRequest(url, method, data, opts);
    };

    return {
        demo: getDemoApi(processRequestLocal, origin),
        form: {
            validateForm: <FormState>(formState: FormState) =>
                processRequestLocal(
                    origin.concat('api/form/validate-form'),
                    'POST',
                    formState,
                ),
        },
        errors: {
            status: (status: number) => processRequestLocal(origin.concat(`api/error/status/${status}`), 'POST'),
            setServerStatus: (status: number) => processRequestLocal(origin.concat(`api//error/set-server-status/${status}`), "'POST'"),
            mock: () => processRequestLocal(origin.concat('api/error/mock'), 'GET'),
            authLost: () => processRequestLocal(origin.concat('api/error/auth-lost'), 'POST'),
        },
        getChangelog() {
            return processRequestLocal(origin.concat('/api/get-changelog'), 'GET');
        },
        getCode(rq: GetCodeParams) {
            return processRequestLocal<GetCodeResponse>(origin.concat('/api/get-code'), 'POST', rq);
        },
        getProps() {
            return processRequestLocal(origin.concat('/api/get-props/'), 'GET');
        },
        getDocsGenType(shortRef: TTypeRef) {
            const refEncoded = encodeURIComponent(shortRef);
            return processRequestLocal<{ content: TType }>(origin.concat(`/api/docs-gen/details/${refEncoded}`), 'GET');
        },
        getDocsGenSummaries() {
            return processRequestLocal<{ content: TDocsGenTypeSummary }>(origin.concat('/api/docs-gen/summaries'), 'GET');
        },
        getDocsGenExports() {
            return processRequestLocal<{ content: Record<string, string[]> }>(origin.concat('/api/docs-gen/exports'), 'GET');
        },
        getThemeTokens() {
            return processRequestLocal<{ content: IUuiTokensCollection['exposedTokens'] }>(origin.concat('/api/theme-tokens'), 'GET');
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
