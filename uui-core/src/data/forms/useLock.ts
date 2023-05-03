import { useEffect, useRef } from 'react';
import { Lock, useUuiContext } from '../../services';

export interface UseLockProps {
    handleLeave: () => Promise<boolean>;
    isEnabled?: boolean;
}

export function useLock({ handleLeave, isEnabled }: UseLockProps): Lock {
    if (!handleLeave) return;

    const context = useUuiContext();
    const handleLeaveRef = useRef<UseLockProps>({ isEnabled: false, handleLeave: null });

    useEffect(() => {
        return () => {
            if (!handleLeaveRef.current.isEnabled) return;
            const currentLock = context.uuiLocks.getCurrentLock();
            currentLock && context.uuiLocks.release(currentLock);
        };
    }, []);

    handleLeaveRef.current.handleLeave = handleLeave;

    if (!handleLeaveRef.current.isEnabled && isEnabled) {
        context.uuiLocks.acquire(() => handleLeaveRef.current.handleLeave());
    }

    if (handleLeaveRef.current.isEnabled && !isEnabled) {
        context.uuiLocks.release(context.uuiLocks.getCurrentLock());
    }

    handleLeaveRef.current.isEnabled = isEnabled;

    return context.uuiLocks.getCurrentLock();
}
