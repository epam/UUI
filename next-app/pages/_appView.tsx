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
import { DragGhost } from "@epam/uui-core";
import type { ComponentType } from "react";

interface MyAppViewProps<TComponent, TPageProps> {
    isLoading?: boolean;
    Component: TComponent;
    pageProps: TPageProps;
}

export function MyAppView<TComponent extends ComponentType>(props: MyAppViewProps<TComponent, any>) {
    const { isLoading, Component, pageProps } = props;
    return (
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
    );
}
