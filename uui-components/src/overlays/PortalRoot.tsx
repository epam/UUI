import React from 'react';
import { isClientSide, markPortalRootInShadowChain, useUuiContext } from '@epam/uui-core';

export function PortalRoot() {
    const { uuiLayout } = useUuiContext();
    const id = uuiLayout.getPortalRootId();
    const cleanupRef = React.useRef<(() => void) | null>(null);

    const handleRef = React.useCallback((node: HTMLDivElement | null) => {
        cleanupRef.current?.();
        cleanupRef.current = null;

        if (!node || !isClientSide) {
            uuiLayout.unregisterPortalRoot(node ?? undefined);
            return;
        }

        uuiLayout.registerPortalRoot(node);
        cleanupRef.current = markPortalRootInShadowChain(node, id);
    }, [id, uuiLayout]);

    React.useLayoutEffect(() => () => {
        cleanupRef.current?.();
        cleanupRef.current = null;
        uuiLayout.unregisterPortalRoot();
    }, [id, uuiLayout]);

    return (
        <div id={ id } ref={ handleRef } />
    );
}
