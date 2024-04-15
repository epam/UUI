"use client";

import {
    DragGhost,
    StubAdaptedRouter,
    UuiContext,
    useUuiServices,
} from "@epam/uui-core";
import { TApi, apiDefinition } from "../helpers/apiDefinition";
import { AppContextType, getAppContext } from "../helpers/appContext";
import { PropsWithChildren, Suspense } from "react";
import { ErrorHandler, Snackbar } from "@epam/promo";
import { AppHeader } from "./AppHeader";
import { Modals } from "@epam/uui-components";

export async function AppView({
    children,
    appContext,
}: PropsWithChildren<{ appContext: AppContextType }>) {
    const { services } = useUuiServices<TApi, AppContextType>({
        appContext,
        apiDefinition,
        router: new StubAdaptedRouter(),
    });

    return (
        <UuiContext.Provider value={services}>
            <ErrorHandler>
                <AppHeader />
                <Suspense>{children}</Suspense>
                <Snackbar />
                <Modals />
                <DragGhost />
            </ErrorHandler>
        </UuiContext.Provider>
    );
}
