import * as React from 'react';
import { CommonContexts, uuiContextTypes } from '../types';
import { DragGhost } from "./dnd";
import * as PropTypes from 'prop-types';
import { ContextProviderProps } from "./ContextProvider";

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

    uuiContexts: CommonContexts<TApi, TAppContext>;

    state = {isLoaded: false};

    constructor(props: LegacyContextProviderProps<TApi, TAppContext>, context: any) {
        super(props, context);
        this.uuiContexts = props.uuiContexts;

        const loadAppContext = props?.loadAppContext || (() => Promise.resolve({} as TAppContext));

        loadAppContext(this.uuiContexts.api).then(appCtx => {
            this.uuiContexts.uuiApp = appCtx;
            props.onInitCompleted(this.uuiContexts);
            this.setState({isLoaded: true});
        });

    }

    render() {
        // Workaround to discard all errors on navigation. Need to find a better way. YakovZh
        (this.uuiContexts.uuiErrors as any).discardError();
        this.uuiContexts.uuiApi.reset();

        //this.uuiContexts.uuiDnD.
        const children = this.state.isLoaded ? this.props.children : '';

        return <>
            { children }
            <DragGhost/>
        </>;
    }

    static childContextTypes = uuiContextTypes;

    getChildContext() {
        return this.uuiContexts;
    }
}