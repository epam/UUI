import { CommonContexts } from '@epam/uui';
import { getApi } from './data';

const tApi = getApi(null);
type Api = typeof tApi;

export interface SandboxServices extends CommonContexts<Api, any> {
}

export const svc: SandboxServices = {} as any;