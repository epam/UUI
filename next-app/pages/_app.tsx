import { UuiContextProviderSsr } from "@epam/uui-core";
import { skinContext } from '@epam/promo';
import type { AppProps } from 'next/app';
import uuiAppData from '../demoData/uuiAppData.json';
import { NextPageContext } from "next";
import { getApi, TApi } from "../helpers/apiDefinition";
import { MyAppView } from "./_appView";
import { useRouter } from "next/router";

interface MyAppProps<TAppContext> extends AppProps {
    appContext?: TAppContext;
}
type AppContextType = Awaited<ReturnType<typeof getInitialProps>>;

function MyApp(props: MyAppProps<AppContextType>) {
    const { Component, pageProps, appContext } = props;
    const nextRouter = useRouter();
    const renderContent = ({ isChangingRoute }: { isChangingRoute: boolean }) => <MyAppView isChangingRoute={ isChangingRoute } { ...{ Component, pageProps } } />;
    return (
        <UuiContextProviderSsr<TApi, AppContextType>
            router={ nextRouter }
            skinContext={ skinContext }
            apiDefinition={ getApi }
            appContext={ appContext }>
            { renderContent }
        </UuiContextProviderSsr>
    );
}

async function getInitialProps(ctx: NextPageContext) {
    const appContext = await uuiAppData;
    return { appContext };
}
MyApp.getInitialProps = getInitialProps;

export default MyApp;
