import uuiAppData from '../demoData/uuiAppData.json';

export async function getAppContext() {
    return await new Promise((resolve) => {
        // Note: Load some data needed for the app
        resolve(uuiAppData);
    });
}

export type AppContextType = typeof uuiAppData;
