import React from 'react';
import { UuiContext, UuiContexts } from '@epam/uui-core';

export class ErrorCatch extends React.Component {
    static contextType = UuiContext;
    public context: UuiContexts;

    constructor(props: {}) {
        super(props);
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.context.uuiErrors.reportError(error);
    }

    render() {
        return this.props.children;
    }
}