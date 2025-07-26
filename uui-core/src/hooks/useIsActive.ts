import { useUuiContext } from '../services';
import { ICanBeActive, ICanRedirect } from '../types';

export interface UseIsActiveProps extends ICanBeActive, Pick<ICanRedirect, 'link'> {}

export interface UseIsActiveResult {
    isActive: boolean;
}

export const useIsActive = (props: UseIsActiveProps): UseIsActiveResult => {
    const context = useUuiContext();
    let isActive: boolean;

    if (props.isLinkActive !== undefined) {
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
