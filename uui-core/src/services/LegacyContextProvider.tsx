import * as React from 'react';
import { CommonContexts, uuiContextTypes } from '../types';
import { DragGhost } from './dnd';
import * as PropTypes from 'prop-types';
import { ContextProviderProps } from './ContextProvider';

interface LegacyContextProviderProps<TApi, TAppContext> extends ContextProviderProps<TApi, TAppContext> {
    uuiContexts: CommonContexts<TApi, TAppContext>;
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
        this.props.uuiContexts.uuiErrors.discardError();
        this.props.uuiContexts.uuiApi.reset();

        //this.uuiContexts.uuiDnD.
        const children = this.props.children;

        return (
            <>
                {children}
                <DragGhost />
            </>
        );
    }

    static childContextTypes = uuiContextTypes;

    getChildContext() {
        return this.props.uuiContexts;
    }
}
