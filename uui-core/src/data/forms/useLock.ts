import { useEffect, useState } from 'react';
import { useUuiContext } from '../../services';
import { Link } from '../../types';

export interface UseLockProps {
    /** Callback which will be called on router change */
    handleLeave?: (nextLocation: Link, currentLocation: Link) => Promise<boolean | 'remain'>;
}

type LockStatus = 'blocked' | 'unblocked' | 'remain';

export function useLock({ handleLeave }: UseLockProps) {
    const context = useUuiContext();
    const [status, setStatus] = useState<LockStatus>();

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
        if (!handleLeave || status === 'blocked') return;
        if (status === 'remain') {
            setStatus('blocked');
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
