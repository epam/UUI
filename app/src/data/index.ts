import { svc } from '../services';

export * from './apiDefinition';
export type TAppContext = Awaited<ReturnType<typeof loadAppContext>>;
export async function loadAppContext() {
    const [
        { content: navigation },
        { content: refs },
    ] = await Promise.all([
        svc.api.getTsDocsNavigation(),
        svc.api.getTsDocsRefs(),
    ]);
    return {
        tsDocs: {
            navigation,
            refs,
        },
    };
}
