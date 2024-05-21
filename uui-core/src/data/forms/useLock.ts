import { useEffect, useState } from 'react';
import { useUuiContext } from '../../services';
import { Link } from '../../types/objects';

export interface UseLockProps {
    /** Callback which will be called on router change */
    handleLeave?: () => Promise<boolean>;
}

export function useLock({ handleLeave }: UseLockProps) {
    const context = useUuiContext();
    const [isLocked, setIsLocked] = useState<boolean>(false);

    const block = () => {
        setIsLocked(true);
    };

    const unblock = () => {
        setIsLocked(false);
    };

    useEffect(() => {
        if (!handleLeave || !isLocked) return;
        let unblockRouter: () => void;
        const routerWillLeave = (nextLocation: Link) =>
            handleLeave()
                .then(() => {
                    unblockRouter();
                    context.uuiRouter.redirect(nextLocation);
                })
                .catch(() => {});

        unblockRouter = context.uuiRouter.block((location) => {
            routerWillLeave(location);
        });

        return () => {
            unblockRouter?.();
        };
    }, [isLocked, handleLeave]);

    return {
        block,
        unblock,
        isLocked,
    };
}
