import { UuiContext, useUuiServicesSsr } from '@epam/uui-core';
import type { AppProps } from 'next/app';
import { apiDefinition, TApi } from "../helpers/apiDefinition";
import { useIsChangingRoute } from "../hooks/useIsChangingRoute";
import { MyAppView } from './_appView'
import { AppContextType, getAppContext } from "../helpers/appContext";

interface MyAppProps<TAppContext> extends AppProps {
    appContext?: TAppContext;
}

function MyApp(props: MyAppProps<AppContextType>) {
    const { Component, pageProps, appContext, router } = props;
    const { services } = useUuiServicesSsr<TApi, AppContextType>({
        appContext,
        apiDefinition,
        router,
    });
    const { isChangingRoute } = useIsChangingRoute(router);
    return (
        <UuiContext.Provider value={ services }>
            <MyAppView isChangingRoute={ isChangingRoute } { ...{ Component, pageProps } } />
        </UuiContext.Provider>
    );
}

async function getInitialProps() {
    const appContext = await getAppContext();
    return { appContext };
}
MyApp.getInitialProps = getInitialProps;

export default MyApp;
