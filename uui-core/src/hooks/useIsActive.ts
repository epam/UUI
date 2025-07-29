import { useUuiContext } from '../services';
import { ICanBeActive, ICanRedirect } from '../types';
import { devLogger } from '../helpers';

export interface UseIsActiveProps extends ICanBeActive, Pick<ICanRedirect, 'link'> {}

export interface UseIsActiveResult {
    isActive: boolean;
}

export const useIsActive = (props: UseIsActiveProps): UseIsActiveResult => {
    const context = useUuiContext();
    let isActive: boolean;

    if (props.isLinkActive !== undefined) {
        devLogger.warn('useIsActive: isLinkActive prop is deprecated. Use isActive prop instead.');
        isActive = props.isLinkActive;
    } else if (props.link && context.uuiRouter) {
        isActive = context.uuiRouter.isActive(props.link);
    } else {
        isActive = props.isActive || false;
    }

    return {
        isActive,
    };
};
