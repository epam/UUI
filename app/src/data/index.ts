import { svc } from '../services';

export * from './apiDefinition';
export type TAppContext = Awaited<ReturnType<typeof loadAppContext>>;
export async function loadAppContext() {
    const { content } = await svc.api.getTsDocsApiReference();
    return {
        docsApiReference: content,
    };
}
