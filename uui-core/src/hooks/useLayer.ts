import { useEffect } from 'react';
import { useUuiContext } from '../services';

export const useLayer = () => {
    const context = useUuiContext();
    const layer = context.uuiLayout?.getLayer();

    useEffect(() => {
        return () => layer && context.uuiLayout?.releaseLayer(layer);
    }, [context]);

    return layer?.zIndex;
};
