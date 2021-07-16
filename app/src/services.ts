import { CommonContexts } from '@epam/uui';
import { getApi } from './data';

type Api = ReturnType<typeof getApi>;

type SandboxServices = CommonContexts<Api, {
    codesandboxFiles: { [key: string]: string }
}>;

export const svc = {} as SandboxServices;