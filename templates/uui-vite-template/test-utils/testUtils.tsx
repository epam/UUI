import * as uuiTestUtils from '@epam/uui-test-utils';
import { ReactNode, ReactElement } from 'react';
import { TApi } from '../src/app/helpers/apiDefinition';
import { TAppContext } from '../src/app/helpers/appContext';
import { ContextProvider } from '@epam/uui-core';

const testAppContext: TAppContext = {};
const testApi: TApi = {
    loadLinksForMainPage: async () => [
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
    ],
};
function TestContextWrapper({ children }: { children?: ReactNode }) {
    return (
        <ContextProvider<TApi, TAppContext>
            onInitCompleted={() => {}}
            apiDefinition={() => testApi}
            loadAppContext={() => Promise.resolve(testAppContext)}
        >
            {children}
        </ContextProvider>
    );
}

/**
 *  re-export UUI test utils 'as is' and override some methods with custom test context
 */
export * from '@epam/uui-test-utils';

// Override method from UUI test utils
export const renderWithContextAsync = async (reactElement: ReactElement) => {
    return uuiTestUtils.renderWithContextAsync(reactElement, {
        wrapper: TestContextWrapper,
    });
};
