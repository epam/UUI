import { GAListener, UuiContextProviderSsr } from "@epam/uui-core";
import { skinContext } from '@epam/promo';
import type { AppProps } from 'next/app';
import uuiAppData from '../demoData/uuiAppData.json';
import { NextPageContext } from "next";
import { AmplitudeListener } from "../helpers/ampListener";
import { getApi, TApi } from "../helpers/apiDefinition";
import { MyAppView } from "./_appView";
import { useRouter } from "next/router";

interface MyAppProps<TAppContext> extends AppProps {
    appContext?: TAppContext;
}
type AppContextType = Awaited<ReturnType<typeof getInitialProps>>;

function getAnalyticsListeners() {
    const AMPLITUDE_KEY = 'b2260a6d42a038e9f9e3863f67042cc1';
    const ampClient =  new AmplitudeListener(AMPLITUDE_KEY);
    const gaClient = new GAListener('UA-132675234-1');
    return [ampClient, gaClient];
}

function MyApp(props: MyAppProps<AppContextType>) {
    const { Component, pageProps, appContext } = props;
    const nextRouter = useRouter();
    return (
        <UuiContextProviderSsr<TApi, AppContextType>
            nextRouter={ nextRouter }
            onGetAnalyticsListeners={ getAnalyticsListeners }
            uuiServicesProps={ { skinContext, apiDefinition: getApi, appContext } }>
            {
                ({ isLoading }) => <MyAppView isLoading={ isLoading } { ...{ Component, pageProps } } />
            }
        </UuiContextProviderSsr>
    );
}

async function getInitialProps(ctx: NextPageContext) {
    const appContext = await uuiAppData;
    return { appContext };
}
MyApp.getInitialProps = getInitialProps;

export default MyApp;
