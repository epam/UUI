import { CommonContexts } from '@epam/uui';
import { getApi } from './data';

const tApi = getApi(null);
type Api = typeof tApi;

export interface SandboxServices extends CommonContexts<Api, any> {
    codesandboxFiles: { [key: string]: string },
}

export const svc: SandboxServices = {} as SandboxServices;