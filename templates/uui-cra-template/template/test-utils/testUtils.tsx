import * as uuiTestUtils from '@epam/uui-test-utils';
import { ReactNode, ReactElement, useState, useEffect } from "react";
import { TAppContext } from "../src/data/appContext";
import { StubAdaptedRouter, useUuiServices, UuiContext } from "@epam/uui-core";
import { TApi } from "../src/data/apiDefinition";
import { svc } from "../src/services";

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

const router = new StubAdaptedRouter();
function TestContextWrapper({ children }: { children?: ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const { services } = useUuiServices<TApi, TAppContext>({ apiDefinition: () => testApi, router });

    useEffect(() => {
        Promise.resolve(testAppContext).then((appCtx) => {
            services.uuiApp = appCtx;
            Object.assign(svc, services);
            setIsLoaded(true);
        })
    }, [services]);

    if (isLoaded) {
        return (
            <UuiContext.Provider value={ services }>
                {children}
            </UuiContext.Provider>
        );
    }
    return null;
}

/**
 *  re-export UUI test utils 'as is' and override some methods with custom test context
 */
export * from '@epam/uui-test-utils';

// Override method from UUI test utils
export const renderWithContextAsync = async (reactElement: ReactElement) => {
    return uuiTestUtils.renderWithContextAsync(reactElement, {
        wrapper: TestContextWrapper as any,
    });
};
