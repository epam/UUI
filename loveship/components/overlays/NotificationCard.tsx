import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

interface NotificationCardMods {
    /**
     * Defines component color.
     */
    color?: EpamPrimaryColor | 'night600' | uui.NotificationCardProps['color'];
}

/** Represents the properties of the NotificationCard component. */
export interface NotificationCardProps extends uui.NotificationCardCoreProps, NotificationCardMods {}

export const NotificationCard = /* @__PURE__ */createSkinComponent<uui.NotificationCardProps, NotificationCardProps>(
    uui.NotificationCard,
    (props) => {
        if (__DEV__) {
            if (props.color === 'night600') {
                devLogger.warn('(NotificationCard) The night600 value of color is deprecated and will be removed in future release. Use color sky instead or consult with your design team.');
            }
        }
        return { ...props, color: props.color };
    },
);
