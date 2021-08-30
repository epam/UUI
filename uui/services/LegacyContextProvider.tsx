import * as React from 'react';
import { CommonContexts } from '../types';
import { DragGhost } from "./dnd";
import * as PropTypes from 'prop-types';
import { ContextProviderProps, UuiContext } from "./ContextProvider";

interface LegacyContextProviderProps<TApi, TAppContext> extends ContextProviderProps<TApi, TAppContext> {
    uuiContexts: CommonContexts<any, any>;
}

interface ContextProviderState {
    isLoaded: boolean;
}

export class LegacyContextProvider<TApi, TAppContext> extends React.Component<LegacyContextProviderProps<TApi, TAppContext>, ContextProviderState> {

    static contextTypes = {
        uuiRouter: PropTypes.object,
        history: PropTypes.object,
    };

    render() {
        // Workaround to discard all errors on navigation. Need to find a better way. YakovZh
        (this.props.uuiContexts.uuiErrors as any).discardError();
        this.props.uuiContexts.uuiApi.reset();

        //this.uuiContexts.uuiDnD.
        const children = this.props.children;

        return <>
            { children }
            <DragGhost/>
        </>;
    }

    static contextType = UuiContext;

    getChildContext() {
        return this.props.uuiContexts;
    }
}