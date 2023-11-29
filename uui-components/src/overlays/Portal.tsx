import * as React from 'react';
import ReactDOM from 'react-dom';
import { IHasChildren, useUuiContext } from '@epam/uui-core';

export interface PortalProps extends IHasChildren {
    /** Element where portal content will be rendered
     * By default, it will be node with 'main' or 'root' id or document.body
     * */
    target?: HTMLElement;
    /** Key of portal component */
    key?: string;
}

export const Portal: React.FC<PortalProps> = (props) => {
    const { uuiLayout } = useUuiContext();
    const rootElement = props.target || uuiLayout.getPortalRoot();
    return ReactDOM.createPortal(props.children, rootElement, props.key);
};
