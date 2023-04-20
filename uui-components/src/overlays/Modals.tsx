import * as React from 'react';
import { UuiContexts, UuiContext } from '@epam/uui-core';

export class Modals extends React.Component {
    static contextType = UuiContext;

    context: UuiContexts;

    constructor(props: {}) {
        super(props);
    }

    componentDidMount() {
        if (!this.context) return;
        this.context.uuiModals.subscribe(() => this.forceUpdate());
    }

    public render() {
        return (
            <>
                {this.context.uuiModals.getOperations().map((modalOperation) => {
                    return React.createElement(modalOperation.component, modalOperation.props);
                })}
            </>
        );
    }
}
