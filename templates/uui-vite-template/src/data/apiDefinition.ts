import { IProcessRequest } from '@epam/uui-core';

export type TMainPageLink = {
    label: string;
    link: string;
    linkLabel: string;
};

export function apiDefinition(processRequest: IProcessRequest) {
    return {
        /**
         * This method is created to demonstrate api definition
         * @param args
         */
        loadLinksForMainPage: async (...args: any[]): Promise<TMainPageLink[]> => {
            // Note: Invoke "processRequest" method to retrieve some data from backend
            return await new Promise((resolve) => {
                resolve([
                    {
                        label: 'UUI docs: ',
                        link: 'https://uui.epam.com/',
                        linkLabel: 'uui.epam.com',
                    },
                    {
                        label: 'Git: ',
                        link: 'https://github.com/epam/uui',
                        linkLabel: 'github.com/epam/uui',
                    },
                ]);
            });
        },
    };
}

export type TApi = ReturnType<typeof apiDefinition>;
