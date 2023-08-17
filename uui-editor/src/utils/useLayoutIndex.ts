import { useEffect, useState } from 'react';
import { useUuiContext } from '@epam/uui-core';

export const useLayoutIndex = () => {
    const context = useUuiContext();
    const [zIndex, setZIndex] = useState(50);

    useEffect(() => {
        const layer = context.uuiLayout?.getLayer();
        setZIndex(layer?.zIndex);
        return () => layer && context.uuiLayout?.releaseLayer(layer);
    }, [context]);

    return zIndex;
};
