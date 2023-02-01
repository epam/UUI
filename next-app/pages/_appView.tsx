import 'normalize.css';
import '../styles/globals.scss';
import '@epam/uui-components/styles.css';
import '@epam/promo/styles.css';
import '@epam/uui/styles.css';
import '@epam/uui-editor/styles.css';
import { Blocker, ErrorHandler } from "@epam/promo";
import { AppHeader } from "../components/AppHeader";
import { SideBar } from "../components/SideBar";
import { Modals, Snackbar } from "@epam/uui-components";
import { DragGhost, GAListener, UuiContext } from "@epam/uui-core";
import type { ComponentType } from "react";
import { useContext, useEffect } from "react";
import { AmplitudeListener } from "../helpers/ampListener";

const AMPLITUDE_KEY = 'b2260a6d42a038e9f9e3863f67042cc1';

interface MyAppViewProps<TComponent, TPageProps> {
    isChangingRoute?: boolean;
    Component: TComponent;
    pageProps: TPageProps;
}

export function MyAppView<TComponent extends ComponentType>(props: MyAppViewProps<TComponent, any>) {
    const { isChangingRoute, Component, pageProps } = props;
    const { uuiAnalytics } = useContext(UuiContext);

    useEffect(() => {
        uuiAnalytics.addListener(new AmplitudeListener(AMPLITUDE_KEY));
        uuiAnalytics.addListener(new GAListener('UA-132675234-1'));
    }, [uuiAnalytics]);

    return (
        <ErrorHandler>
            <div className={ 'container' }>
                <AppHeader />
                <SideBar />
                <div className={ 'mainContainer' }>
                    <Component { ...pageProps } />
                    { isChangingRoute && <Blocker isEnabled={ isChangingRoute }/> }
                </div>
                <Snackbar />
                <Modals />
                <DragGhost />
            </div>
        </ErrorHandler>
    );
}
