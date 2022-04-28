import React from 'react';
import { UuiContext, UuiContexts } from '@epam/uui-core';

interface ErrorCatchProps {
    children: React.ReactNode;
}

export class ErrorCatch extends React.Component<ErrorCatchProps> {
    static contextType = UuiContext;
    public context: UuiContexts;

    constructor(props: ErrorCatchProps) {
        super(props);
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.context.uuiErrors.reportError(error);
    }

    render() {
        return this.props.children;
    }
}