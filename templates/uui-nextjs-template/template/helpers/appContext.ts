export async function getAppContext() {
    return await new Promise(resolve => {
        // Note: Load some data needed for the app
        resolve({});
    });
}

export type AppContextType = Awaited<ReturnType<typeof getAppContext>>;
