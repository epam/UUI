import { svc } from '../services';

export * from './apiDefinition';
export type TAppContext = Awaited<ReturnType<typeof loadAppContext>>;
export async function loadAppContext() {
    if (!svc.api) {
        throw new Error('svc.api not available');
    }
    const { content: navigation } = await svc.api.getDocsGenExports();
    return {
        docsGen: {
            navigation,
        },
    };
}
