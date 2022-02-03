import * as React from "react";
import { findDOMNode } from "react-dom";

interface TooltipWrapperProps {
    innerRef: any;
}

export class PopperTargetWrapper extends React.Component<TooltipWrapperProps> {
    componentDidMount() {
        const node = findDOMNode(this);
        this.props.innerRef(node);
    }

    componentDidUpdate() {
        const node = findDOMNode(this);
        this.props.innerRef(node);
    }

    render() {
        return this.props.children;
    }
}