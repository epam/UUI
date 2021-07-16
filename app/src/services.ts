import { CommonContexts } from '@epam/uui';
import { getApi } from './data';

type Api = ReturnType<typeof getApi>;

type SandboxServices = Partial<CommonContexts<Api, {
    codesandboxFiles: { [key: string]: string }
}>>;

export const svc: SandboxServices = {};