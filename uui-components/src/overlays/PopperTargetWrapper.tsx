import * as React from "react";
import { findDOMNode } from "react-dom";

interface TooltipWrapperProps {
    innerRef: React.Ref<HTMLElement>;
}

export class PopperTargetWrapper extends React.Component<TooltipWrapperProps> {
    componentDidMount(): void {
        const node = findDOMNode(this) as HTMLElement;
        (this.props.innerRef as React.RefCallback<HTMLElement>)(node);
    }

    render() {
        return this.props.children;
    }
}