import { useCallback, useEffect, useRef } from 'react';

export const useAbortController = () => {
    const abortControllerRef = useRef<AbortController>(null);

    const getAbortSignal = useCallback(() => {
        if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
            abortControllerRef.current = new AbortController();
        }

        return abortControllerRef.current.signal;
    }, [abortControllerRef.current]);

    useEffect(() => {
        if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
            abortControllerRef.current = new AbortController();
        }

        return () => {
            if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return { getAbortSignal };
};
