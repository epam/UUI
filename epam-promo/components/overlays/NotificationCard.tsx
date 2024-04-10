import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

interface NotificationCardMods {
    /**
     * Defines component color.
     */
    color?: EpamPrimaryColor | 'gray60' | uui.NotificationCardProps['color'];
}

/** Represents the properties of a NotificationCard component. */
export interface NotificationCardProps extends uui.NotificationCardCoreProps, NotificationCardMods {}

export const NotificationCard = /* @__PURE__ */createSkinComponent<uui.NotificationCardProps, NotificationCardProps>(
    uui.NotificationCard,
    (props) => {
        if (__DEV__) {
            if (props.color === 'gray60') {
                devLogger.warn('(NotificationCard) The gray60 value of color is deprecated and will be removed in future release. Use color blue instead or consult with your design team.');
            }
        }
        return { ...props, color: props.color };
    },
);
