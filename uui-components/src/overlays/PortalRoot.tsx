import React from 'react';
import { useUuiContext } from '@epam/uui-core';

export function PortalRoot() {
    const { uuiLayout } = useUuiContext();
    const id = uuiLayout.getPortalRootId();

    return (
        <div id={ id } />
    );
}
