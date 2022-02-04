import * as React from "react";
import { findDOMNode } from "react-dom";

interface TooltipWrapperProps {
    innerRef: React.RefCallback<HTMLElement>;
}

export class PopperTargetWrapper extends React.Component<TooltipWrapperProps> {
    componentDidMount() {
        const node = findDOMNode(this) as HTMLElement;
        this.props.innerRef(node);
    }

    componentDidUpdate() {
        const node = findDOMNode(this) as HTMLElement;
        this.props.innerRef(node);
    }

    render() {
        return this.props.children;
    }
}