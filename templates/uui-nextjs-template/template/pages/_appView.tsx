import '../styles/globals.css';
import '@epam/uui-components/styles.css';
import '@epam/uui/styles.css';
import '@epam/assets/theme/theme_loveship.scss';
import { DragGhost } from "@epam/uui-core";
import { Blocker, ErrorHandler } from "@epam/promo";
import { AppHeader } from "../components/AppHeader";
import { Modals, Snackbar } from "@epam/uui-components";
import { ComponentType } from 'react';

interface MyAppViewProps<TComponent, TPageProps> {
    Component: TComponent;
    pageProps: TPageProps;
    isChangingRoute: boolean;
}

export function MyAppView<TComponent extends ComponentType>(props: MyAppViewProps<TComponent, any>) {
    const { pageProps, isChangingRoute, Component } = props;
    return (
        <ErrorHandler>
            <AppHeader />
            <Component { ...pageProps } />
            { isChangingRoute && <Blocker isEnabled={ isChangingRoute }/> }
            <Snackbar />
            <Modals />
            <DragGhost />
        </ErrorHandler>
    );
}
