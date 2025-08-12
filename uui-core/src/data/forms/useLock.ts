import { useEffect, useRef } from 'react';
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

export function useLock({ handleLeave, isEnabled }: UseLockProps) {
    const context = useUuiContext();
    const unblockRouterRef = useRef(() => {});
    const isBlockerRef = useRef(false);

    const block = () => {
        if (!isEnabled || isBlockerRef.current === true) return;
        blockRouter();
    };

    const unblock = () => {
        unblockRouterRef.current();
        isBlockerRef.current = false;
    };

    const blockRouter = () => {
        isBlockerRef.current = true;
        const routerWillLeave = (nextLocation: Link) => {
            const currentLocation = context.uuiRouter.getCurrentLink();

            return handleLeave(nextLocation, currentLocation)
                .then((res) => {
                    unblock();
                    context.uuiRouter.redirect(nextLocation);
                    if (res === 'remain') {
                        blockRouter();
                    }
                })
                .catch(() => {});
        };
        const unblockRouter = context.uuiRouter.block((location) => {
            routerWillLeave(location);
        });
        unblockRouterRef.current = unblockRouter;
    };

    useEffect(() => {
        return () => {
            unblock();
        };
    }, []);

    return {
        block,
        unblock,
        isLocked: isBlockerRef.current === true,
    };
}
