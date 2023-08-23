import { useEffect, useRef } from 'react';
import { useUuiContext } from '../services';

export const useLayer = () => {
    const context = useUuiContext();
    const layer = useRef(context.uuiLayout?.getLayer()).current;

    useEffect(() => {
        return () => layer && context.uuiLayout?.releaseLayer(layer);
    }, [context]);

    return layer;
};
