import * as React from 'react';
import { uuiContextTypes, UuiContexts, ModalContext } from '@epam/uui';

export class Modals extends React.Component {
    static contextTypes = uuiContextTypes;

    constructor(props: any, context: UuiContexts) {
        super(props, context);
        this.context.uuiModals.subscribe(() => this.forceUpdate());
    }

    public render() {
        return this.context.uuiModals.getOperations().map((modalOperation: any) => {
            return React.createElement(modalOperation.component, modalOperation.props);
        });
    }
}