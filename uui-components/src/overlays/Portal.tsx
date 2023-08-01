import * as React from 'react';
import ReactDOM from 'react-dom';
import { IHasChildren, useUuiContext } from '@epam/uui-core';

export interface PortalProps extends IHasChildren {
    target?: HTMLElement;
    key?: string;
}

export const Portal: React.FC<PortalProps> = (props) => {
    const { uuiLayout } = useUuiContext();
    const rootElement = props.target || uuiLayout.getPortalRoot();
    return ReactDOM.createPortal(props.children, rootElement, props.key);
};
