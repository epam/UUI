import 'normalize.css';
import '../styles/globals.scss';
import '@epam/uui-components/styles.css';
import '@epam/promo/styles.css';
import '@epam/uui/styles.css';
import '@epam/uui-editor/styles.css';
import { DragGhost } from "@epam/uui-core";
import { Snackbar, Modals } from "@epam/uui-components";
import { Blocker, ErrorHandler } from '@epam/promo';
import type { AppProps } from 'next/app';
import { SideBar } from "../components/SideBar";
import { AppHeader } from "../components/AppHeader";
import uuiAppData from '../demoData/uuiAppData.json';
import { NextPageContext } from "next";
import { UuiContext } from '@epam/uui-core';
import { useServices } from "../hooks/useServices";

interface MyAppProps<TAppContext> extends AppProps {
    appData?: TAppContext;
}

const MyApp = ({ Component, pageProps, appData }: MyAppProps<any>) => {

    const { services, isLoading } = useServices({ appData });

    return (
        <UuiContext.Provider value={ services }>
            <ErrorHandler>
                <div className={ 'container' }>
                    <AppHeader />
                    <SideBar />
                    <div className={ 'mainContainer' }>
                        <Component { ...pageProps } />
                        { isLoading && <Blocker isEnabled={ isLoading }/> }
                    </div>
                    <Snackbar />
                    <Modals />
                    <DragGhost />
                </div>
            </ErrorHandler>
        </UuiContext.Provider>
    );
};


MyApp.getInitialProps = async (ctx: NextPageContext) => {
    const appData = await uuiAppData;
    return {
        appData,
    };
};

export default MyApp;
