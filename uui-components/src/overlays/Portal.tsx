import * as React from 'react';
import ReactDOM from 'react-dom';
import { IHasChildren } from "@epam/uui-core";
import { useEffect } from "react";

export interface PortalProps extends IHasChildren {
    target?: HTMLElement;
    key?: string;
}

export const Portal: React.FC<PortalProps> = (props) => {
    const [isMounted, setIsMounted] = React.useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounted) return null;

    const rootElement = props.target || document.getElementById('main') || document.getElementById('root') || document.body;
    return ReactDOM.createPortal(props.children, rootElement, props.key);
};
