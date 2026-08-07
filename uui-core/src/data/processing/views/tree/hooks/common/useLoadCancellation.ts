import { useCallback, useEffect, useRef } from 'react';

export const isAbortError = (error: unknown) =>
    error instanceof Error && error.name === 'AbortError';

/**
 * Tracks the current load generation via AbortSignal.
 * `abort()` cancels the in-flight generation; the next `getSignal()` starts a new one.
 */
export const useLoadCancellation = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    const getSignal = useCallback(() => {
        if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
            abortControllerRef.current = new AbortController();
        }

        return abortControllerRef.current.signal;
    }, []);

    const abort = useCallback(() => {
        abortControllerRef.current?.abort();
    }, []);

    useEffect(() => () => {
        abortControllerRef.current?.abort();
    }, []);

    return { getSignal, abort };
};
