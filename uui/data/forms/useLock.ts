import { MutableRefObject, useRef } from "react";
import { useUuiContext } from "../../";

export interface UseLockProps {
    handleLeave: () => Promise<boolean>;
    isEnabled?: boolean;
};

export interface UseLockApi {
    lock: MutableRefObject<object | null>;
    releaseLock: () => void;
    acquireLock: () => void;
    updateLock: () => Promise<void>;
};

export function useLock({ handleLeave, isEnabled = false }: UseLockProps): UseLockApi {
    const context = useUuiContext();
    const lock = useRef<object | null>();
    const handleLeaveRef = useRef<UseLockProps>({ isEnabled: false, handleLeave: null });

    const releaseLock = () => {
        if (!lock.current || !isEnabled) return;
        context.uuiLocks.release(lock.current);
        setLock(null);
    };

    const updateLock = async () => {
        const acquiredLock = await context.uuiLocks.withLock(() => handleLeaveRef.current.handleLeave());
        return setLock(acquiredLock);
    };

    const acquireLock = () => {
        if (!lock.current) return;
        return context.uuiLocks.acquire(() => Promise.resolve())
            .then(lock => context.uuiLocks.release(lock))
            .catch(lock => context.uuiLocks.release(lock));
    };

    const getLock = async () => {
        const acquiredLock = await context.uuiLocks.acquire(() => handleLeaveRef.current.handleLeave());
        if (lock.current) return context.uuiLocks.release(acquiredLock);
        setLock(acquiredLock);
    };

    const setLock = (acquiredLock: object) => {
        lock.current = acquiredLock
    };

    handleLeaveRef.current.handleLeave = handleLeave;
    if (!handleLeaveRef.current.isEnabled && isEnabled) getLock();
    if (handleLeaveRef.current.isEnabled && !isEnabled) releaseLock();
    handleLeaveRef.current.isEnabled = isEnabled;

    return {
        lock,
        releaseLock,
        updateLock,
        acquireLock,
    };
};