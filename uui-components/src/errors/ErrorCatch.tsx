import React from 'react';
import { IHasChildren, UuiContext, UuiContexts } from '@epam/uui-core';

interface ErrorCatchProps extends IHasChildren {}

export class ErrorCatch extends React.Component<ErrorCatchProps> {
    static contextType = UuiContext;
    public context: UuiContexts;
    constructor(props: ErrorCatchProps) {
        super(props);
    }

    componentDidCatch(error: Error) {
        this.context.uuiErrors.reportError(error);
    }

    render() {
        return this.props.children;
    }
}
