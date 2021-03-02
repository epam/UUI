import * as React from 'react';
import { IEditable } from '../types/props';
import { createFactory } from 'react';
import { uuiContextTypes, UuiContexts } from '../types/contexts';

const reduxDevTools: any = null; //(window as any).__REDUX_DEVTOOLS_EXTENSION__;

type StatefulStorageType = 'state' | 'query';
type StatefulStorageSettings<T> = StatefulStorageType; // TBD: allow per-field settings

export interface StatefulProps<T> {
    initialState: Partial<T>;
    render(props: IEditable<T>): React.ReactNode;
    storage?: StatefulStorageSettings<T>;
}

export class Stateful<T = any> extends React.Component<StatefulProps<T>, { state: T }> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    state = { state: this.props.initialState as any };
    devTools: any;

    componentWillMount() {
        if (reduxDevTools) {
            this.devTools = reduxDevTools.connect();
        }
    }

    componentWillUnmount() {
        if (reduxDevTools) {
            this.devTools = reduxDevTools.disconnect();
        }
    }

    getCurrentState(): T {
        if (this.props.storage == null || this.props.storage === 'state') {
            return this.state.state;
        } else if (this.props.storage === 'query') {
            const query = this.context.uuiRouter.getCurrentLink().query;
            return { ...this.props.initialState, ...query };
        }
    }

    handleStateUpdate = (newState: T) => {
        if (reduxDevTools) {
            this.devTools.send('onValueChange', newState);
        }

        if (this.props.storage == null || this.props.storage === 'state') {
            this.setState(_ => ({ state: newState }));
        } else if (this.props.storage === 'query') {
            const link = this.context.uuiRouter.getCurrentLink();
            this.context.uuiRouter.redirect({ ...link, query: newState });
        }
    }

    render() {
        return this.props.render({
            value: this.getCurrentState(),
            onValueChange: this.handleStateUpdate,
        });
    }
}