import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

interface NotificationCardMods {
    /**
     * Defines component color.
     */
    color?: EpamPrimaryColor | uui.NotificationCardProps['color'];
}

/** Represents the properties of a NotificationCard component. */
export interface NotificationCardProps extends uui.NotificationCardCoreProps, NotificationCardMods {}

export const NotificationCard = createSkinComponent<uui.NotificationCardProps, NotificationCardProps>(
    uui.NotificationCard,
    (props) => {
        return { ...props, color: props.color };
    },
);
