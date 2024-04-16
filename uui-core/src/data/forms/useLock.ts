import { useEffect } from 'react';
import { useUuiContext } from '../../services';
import { Link } from '../../types';

export interface UseLockProps {
    /** Callback which will be called on router change */
    handleLeave?: (nextLocation: Link, currentLocation: Link) => Promise<boolean>;
    /** Pass true, to enable lock */
    isEnabled?: boolean;
}

export function useLock({ handleLeave, isEnabled }: UseLockProps) {
    const context = useUuiContext();

    useEffect(() => {
        if (!handleLeave || !isEnabled) return;

        let unblock: () => void;

        const routerWillLeave = (nextLocation: Link) => {
            const currentLocation = context.uuiRouter.getCurrentLink();

            return handleLeave(nextLocation, currentLocation)
                .then(() => {
                    unblock();
                    context.uuiRouter.redirect(nextLocation);
                })
                .catch(() => {});
        };

        unblock = context.uuiRouter.block((location) => {
            routerWillLeave(location);
        });

        return () => {
            unblock();
        };
    }, [isEnabled]);
}
