import React from 'react';
import { isClientSide, useUuiContext } from '@epam/uui-core';
import { makePortalRootDiscoverable } from './PortalRootHelpers';

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
