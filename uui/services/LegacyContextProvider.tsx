import * as React from 'react';
import { IHasChildren, CommonContexts, uuiContextTypes } from '../types';
import { DragGhost } from "./dnd";
import * as PropTypes from 'prop-types';
import { ISkin } from '../services/SkinContext';
import { IHistory4 } from './routing/HistoryAdaptedRouter';
import { getUuiContexts } from "./UuiContext";

export interface ContextProviderProps<TApi, TAppContext> extends IHasChildren {
    apiServerUrl?: string;
    gaCode?: string;
    ampCode?: string;
    loadAppContext?: (api: TApi) => Promise<TAppContext>;
    apiDefinition?: (processRequest: (request: string, requestMethod: string) => any) => TApi;
    onInitCompleted(svc: CommonContexts<TApi, TAppContext>): void;
    history?: IHistory4;
    skinContext?: ISkin;
    enableLegacyContext?: boolean;
}

interface ContextProviderState {
    isLoaded: boolean;
}

export class LegacyContextProvider<TApi, TAppContext> extends React.Component<ContextProviderProps<TApi, TAppContext>, ContextProviderState> {

    static contextTypes = {
        uuiRouter: PropTypes.object,
        history: PropTypes.object,
    };

    uuiContexts: CommonContexts<TApi, TAppContext>;

    state = {isLoaded: false};

    constructor(props: ContextProviderProps<TApi, TAppContext>, context: any) {
        super(props, context);
        this.uuiContexts = getUuiContexts(props);

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