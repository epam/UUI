import { IProcessRequest } from "@epam/uui-core";

export function apiDefinition(processRequest: IProcessRequest) {
    return {
        getDataFromApi1: async (...args: any[]) => {
            // Note: Invoke "processRequest" method to retrieve some data from backend
            return await new Promise(resolve => {
                // Note: this is a mock response
                resolve({ testData: 'This is just a test data.' });
            })
        },
    };
}

export type TApi = ReturnType<typeof apiDefinition>;
