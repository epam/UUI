import { devLogger, withMods } from '@epam/uui-core';
import { Avatar as uuiAvatar, AvatarProps } from '@epam/uui-components';

export const Avatar = withMods<AvatarProps>(
    uuiAvatar,
    () => [],
    (props) => {
        if (__DEV__) {
            if (props.onClick) {
                devLogger.warn('Avatar: Property onClick is deprecated and will be removed in the future release.');
            }
        }
        return null;
    },
);
