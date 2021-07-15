import { CommonContexts } from '@epam/uui';
import { getApi } from './data';

const tApi = getApi(null);
type Api = typeof tApi;

type SandboxServices = CommonContexts<Api, {
    codesandboxFiles: { [key: string]: string }
}>;

export const svc: SandboxServices = {} as SandboxServices;