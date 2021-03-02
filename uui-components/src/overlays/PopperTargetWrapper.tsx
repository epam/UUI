import * as React from "react";
import * as reactDom from "react-dom";

interface TooltipWrapperProps {
    innerRef: any;
}

export class PopperTargetWrapper extends React.Component<TooltipWrapperProps> {
    componentDidMount(): void {
        const node = reactDom.findDOMNode(this);
        this.props.innerRef(node);
    }

    componentDidUpdate(): void {
        const node = reactDom.findDOMNode(this);
        this.props.innerRef(node);
    }

    render() {
        return this.props.children;
    }
}