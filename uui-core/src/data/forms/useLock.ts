import { useEffect } from 'react';
import { useUuiContext } from '../../services';
import { Link } from '../../types/objects';

export interface UseLockProps {
    /** Callback which will be called on router change */
    handleLeave?: () => Promise<boolean>;
    /** Pass true, to enable lock */
    isEnabled?: boolean;
}

export function useLock({ handleLeave, isEnabled }: UseLockProps) {
    const context = useUuiContext();

    useEffect(() => {
        if (!handleLeave || !isEnabled) return;

        let unblock: () => void;

        const routerWillLeave = (nextLocation: Link) =>
            handleLeave()
                .then(() => {
                    unblock();
                    context.uuiRouter.redirect(nextLocation);
                })
                .catch(() => {});

        unblock = context.uuiRouter.block((location) => {
            routerWillLeave(location);
        });

        return () => {
            unblock();
        };
    }, [isEnabled]);
}
