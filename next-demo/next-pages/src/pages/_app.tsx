import { GAListener, useUuiServicesSsr, UuiContext } from '@epam/uui-core';
import type { AppProps } from 'next/app';
import { apiDefinition, TApi } from '../helpers/apiDefinition';
import { MyAppView } from './_appView';
import { useEffect } from 'react';
import { useIsChangingRoute } from '../hooks/useIsChangingRoute';
import { AmplitudeListener } from '../helpers/ampListener';
import { AppContextType, getAppContext } from '../helpers/appContext';

const AMPLITUDE_KEY = 'b2260a6d42a038e9f9e3863f67042cc1';
const GA_KEY = 'UA-132675234-1';

interface MyAppProps<TAppContext> extends AppProps {
    appContext?: TAppContext;
}

function MyApp(props: MyAppProps<AppContextType>) {
    const { Component, pageProps, router } = props;

    const { services } = useUuiServicesSsr<TApi, AppContextType>({
        apiDefinition,
        router,
    });

    useEffect(() => {
        services.uuiAnalytics.addListener(new AmplitudeListener(AMPLITUDE_KEY));
        services.uuiAnalytics.addListener(new GAListener(GA_KEY));
    }, [services.uuiAnalytics]);

    const { isChangingRoute } = useIsChangingRoute(router);

    return (
        (<UuiContext.Provider value={services}>
            <MyAppView
                isChangingRoute={isChangingRoute}
                {...{
                    Component,
                    pageProps,
                }}
            />
        </UuiContext.Provider>)
    );
}

MyApp.getInitialProps = async function getInitialProps() {
    const appContext = await getAppContext();
    return { appContext };
};

export default MyApp;
