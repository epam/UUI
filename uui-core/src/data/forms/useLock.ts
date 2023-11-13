import { useEffect } from 'react';
import { useUuiContext } from '../../services';
import { Link } from '../../types/objects';

export interface UseLockProps {
    handleLeave?: () => Promise<boolean>;
    isEnabled?: boolean;
}

export function useLock({ handleLeave, isEnabled }: UseLockProps) {
    const context = useUuiContext();

    useEffect(() => {
        if (!handleLeave || !isEnabled) return;

        let unblock: any;
        let locked = true;

        const routerWillLeave = (nextLocation: Link) => {
            if (locked) {
                handleLeave()
                    .then(() => {
                        unblock();
                        context.uuiRouter.redirect(nextLocation);
                    })
                    .catch(() => {});
            }
        };

        unblock = context.uuiRouter.block((location) => {
            routerWillLeave(location);
        });

        return () => {
            locked = true;
            unblock();
        };
    }, [isEnabled, handleLeave, context.uuiRouter]);
}
