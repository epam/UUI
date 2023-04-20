import * as React from 'react';
import ReactDOM from 'react-dom';
import { IHasChildren } from '@epam/uui-core';

export interface PortalProps extends IHasChildren {
    target?: HTMLElement;
    key?: string;
}

export const Portal: React.FC<PortalProps> = (props) => {
    const rootElement = props.target || document.getElementById('main') || document.getElementById('root') || document.body;
    return ReactDOM.createPortal(props.children, rootElement, props.key);
};
