import React from 'react';
import { isClientSide, useUuiContext } from '@epam/uui-core';

/**
 * Adds a marker to the shadow host which helps the LayoutContext
 * to find this portal root element if it's located under shadow DOM.
 *
 * @param node
 * @param id
 */
function makePortalRootDiscoverable(node: HTMLElement, id: string): () => void {
    if (node) {
        const root = node.getRootNode();
        if (root instanceof ShadowRoot) {
            const hostElem = root.host;
            const name = 'data-shadow-host-id';
            hostElem.setAttribute(name, id);
            return () => {
                hostElem.removeAttribute(name);
            };
        }
    }
    return () => {};
}

export function PortalRoot() {
    const { uuiLayout } = useUuiContext();
    const ref = React.useRef(null);
    const id = uuiLayout.getPortalRootId();

    // TODO: immprove on server side
    React.useLayoutEffect(() => {
        if (isClientSide) {
            return makePortalRootDiscoverable(ref.current, id);
        }
    }, [id]);

    return (
        <div id={ id } ref={ ref } />
    );
}
