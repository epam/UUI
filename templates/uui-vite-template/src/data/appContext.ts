import { TApi } from './apiDefinition';

export async function loadAppContext(api: TApi) {
    return await new Promise((resolve) => {
        // Note: Load some data needed for the app
        resolve({});
    });
}

export type TAppContext = Awaited<ReturnType<typeof loadAppContext>>;
