import { useEffect, useState } from 'react';
import { useUuiContext } from '../../services';
import { Link } from '../../types';

export interface UseLockProps {
    /** Callback, which will be called on router change */
    handleLeave?: (nextLocation: Link, currentLocation: Link) => Promise<boolean | 'remain'>;
    /**
     * Pass true to enable lock mechanism.
     * If false, the lock mechanism will be disabled - router can't be blocked
     */
    isEnabled: boolean;
}

type LockStatus = 'blocked' | 'unblocked' | 'remain';

export function useLock({ handleLeave, isEnabled }: UseLockProps) {
    const context = useUuiContext();
    const [status, setStatus] = useState<LockStatus>('unblocked');

    const block = () => {
        setStatus('blocked');
    };

    const unblock = () => {
        setStatus('unblocked');
    };

    const blockRouter = () => {
        let unblockRouter: () => void;
        const routerWillLeave = (nextLocation: Link) => {
            const currentLocation = context.uuiRouter.getCurrentLink();

            return handleLeave(nextLocation, currentLocation)
                .then((res) => {
                    unblockRouter();
                    context.uuiRouter.redirect(nextLocation);
                    if (res === 'remain') {
                        setStatus('remain');
                    }
                })
                .catch(() => {});
        };
        unblockRouter = context.uuiRouter.block((location) => {
            routerWillLeave(location);
        });
        return unblockRouter;
    };

    useEffect(() => {
        if (!isEnabled || status === 'unblocked') return;
        if (status === 'remain') {
            setStatus('blocked');
            return;
        }

        const unblockRouter = blockRouter();

        return () => {
            unblockRouter?.();
        };
    }, [handleLeave, status]);

    return {
        block,
        unblock,
        isLocked: status !== 'unblocked',
    };
}
