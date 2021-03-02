import * as React from 'react';
import { LayoutContext } from './LayoutContext';
import { IHasChildren, CommonContexts, uuiContextTypes, ApiCallOptions } from '../types';
import { DndContext, DragGhost } from "./dnd";
import * as PropTypes from 'prop-types';
import { StubAdaptedRouter } from './routing/StubAdaptedRouter';
import { NotificationContext } from './NotificationContext';
import { UserSettingsContext } from './UserSettingsContext';
import { AnalyticsContext } from './AnalyticsContext';
import { ErrorContext } from './ErrorContext';
import { ApiContext } from './ApiContext';
import { ModalContext } from './ModalContext';
import { LockContext } from './LockContext';
import { uuiSkin, ISkin } from '../services/SkinContext';
import { HistoryAdaptedRouter, IHistory4 } from './routing/HistoryAdaptedRouter';

export interface ContextProviderProps<TApi, TAppContext> extends IHasChildren {
    apiServerUrl?: string;
    gaCode?: string;
    ampCode?: string;
    loadAppContext?: (api: TApi) => Promise<TAppContext>;
    apiDefinition?: (processRequest: (request: string, requestMethod: string) => any) => TApi;
    onInitCompleted(svc: CommonContexts<TApi, TAppContext>): void;
    history?: IHistory4;
    skinContext?: ISkin;
}

interface ContextProviderState {
    isLoaded: boolean;
}

export class ContextProvider<TApi, TAppContext> extends React.Component<ContextProviderProps<TApi, TAppContext>, ContextProviderState> {

    static contextTypes = {
        uuiRouter: PropTypes.object,
        history: PropTypes.object,
    };

    uuiContexts: CommonContexts<TApi, TAppContext>;

    state = {isLoaded: false};

    constructor(props: ContextProviderProps<TApi, TAppContext>, context: any) {
        super(props, context);
        let history = this.context.history || this.props.history;
        let uuiLayout = new LayoutContext();
        let uuiModals = new ModalContext(uuiLayout);

        let uuiNotifications = new NotificationContext(uuiLayout);

        let uuiRouter = context.uuiRouter; /* TBD: Deprecate legacy router */
        if (uuiRouter == null) {
            if (history != null) {
                uuiRouter = new HistoryAdaptedRouter(history);
            } else {
                uuiRouter = new StubAdaptedRouter();
            }
        }

        let uuiAnalytics = new AnalyticsContext({
            gaCode: props.gaCode,
            ampCode: props.ampCode,
            router: uuiRouter,
        });
        let uuiLocks = new LockContext(uuiRouter);
        let uuiErrors = new ErrorContext(uuiAnalytics, uuiModals);
        let uuiApi = new ApiContext(uuiErrors, props.apiServerUrl, uuiAnalytics);


        let rawApi = props?.apiDefinition ? props.apiDefinition(uuiApi.processRequest.bind(uuiApi)) : {} as TApi;
        let withOptions = (options: ApiCallOptions) => props.apiDefinition(
            (url: string, method: string, data?: any) => uuiApi.processRequest(url, method, data, options),
        );
        let api = {...rawApi, withOptions};

        let uuiUserSettings = new UserSettingsContext();
        let uuiDnD = new DndContext();

        uuiSkin.setSkin(props.skinContext);

        this.uuiContexts = {
            history,
            uuiAnalytics,
            uuiErrors,
            uuiApi,
            api,
            uuiLayout,
            uuiNotifications,
            uuiModals,
            uuiUserSettings,
            uuiDnD,
            uuiRouter,
            uuiLocks,
            uuiApp: {} as TAppContext,
            uuiSkin: uuiSkin,
        };

        const loadAppContext = props?.loadAppContext || (() => Promise.resolve({} as TAppContext));

        loadAppContext(api).then(appCtx => {
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