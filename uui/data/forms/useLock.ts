import { useEffect, useRef } from "react";
import { useUuiContext } from "../../";

export interface UseLockProps {
    handleLeave: () => Promise<boolean>;
    isEnabled?: boolean;
};

export function useLock({ handleLeave, isEnabled }: UseLockProps) {
    if (!handleLeave) return;

    const context = useUuiContext();
    const handleLeaveRef = useRef<UseLockProps>({ isEnabled: false, handleLeave: null });

    useEffect(() => {
        return () => {
            context.uuiLocks.acquire(() => Promise.resolve())
                .then(lock => context.uuiLocks.release(lock))
                .catch(lock => context.uuiLocks.release(lock));
        }
    }, []);

    handleLeaveRef.current.handleLeave = handleLeave;

    if (!handleLeaveRef.current.isEnabled && isEnabled) {
        context.uuiLocks.acquire(() => handleLeaveRef.current.handleLeave());
    }

    if (handleLeaveRef.current.isEnabled && !isEnabled) {
        context.uuiLocks.release(context.uuiLocks.getCurrentLock());
    };

    handleLeaveRef.current.isEnabled = isEnabled;
};