import { useEffect, useRef } from 'react';
import { LayoutLayer, useUuiContext } from '../services';

export const useLayer = () => {
    const context = useUuiContext();
    const layer = useRef<LayoutLayer>(undefined);

    useEffect(() => {
        layer.current = context.uuiLayout.getLayer();
        return () => layer.current && context.uuiLayout?.releaseLayer(layer.current);
    }, []);

    return layer.current;
};
