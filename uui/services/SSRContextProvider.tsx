import React, { useMemo } from "react";
import { DragGhost } from "./dnd";
import { ContextProviderProps, getUuiContexts, UuiContext } from './ContextProvider';
import { CommonContexts, IRouterContext } from "../types";
import { IHistory4 } from "./routing";

export interface SSRContextProvider<TApi, TAppContext> extends Omit<ContextProviderProps<TApi, TAppContext>, 'enableLegacyContext'> {
    uuiApp?: TAppContext;
    history?: IHistory4;
    uuiRouter?: IRouterContext;
}

export const SSRContextProvider = <TApi, TAppContext>(props: SSRContextProvider<TApi, TAppContext>) => {

    const uuiContexts = useMemo<CommonContexts<TApi, TAppContext>>(() => ({
        ...getUuiContexts(props, props.uuiRouter),
        uuiApp: props.uuiApp || {} as TAppContext,
    }), []);

    if (props.uuiRouter && props.history) {
        console.warn('You have transferred as props both: history and uuiRouter. In this case, only uuiRouter will be used!');
    }

    props.onInitCompleted(uuiContexts);

    // Workaround to discard all errors on navigation. Need to find a better way. YakovZh
    (uuiContexts.uuiErrors as any).discardError();
    uuiContexts.uuiApi.reset();

    return (
        <UuiContext.Provider value={ uuiContexts }>
            { props.children }
            <DragGhost/>
        </UuiContext.Provider>
    );
};
