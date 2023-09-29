import { svc } from '../services';

export * from './apiDefinition';
export type TAppContext = Awaited<ReturnType<typeof loadAppContext>>;
export async function loadAppContext() {
    if (!svc.api) {
        throw new Error('svc.api not available');
    }
    const [
        { content: navigation },
        { content: summaries },
    ] = await Promise.all([
        svc.api.getTsDocsExports(),
        svc.api.getTsDocSummaries(),
    ]);
    return {
        tsDocs: {
            navigation,
            summaries,
        },
    };
}
