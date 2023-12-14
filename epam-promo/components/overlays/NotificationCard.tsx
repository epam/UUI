import { withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

interface NotificationCardMods {
    /**
     * Defines component color.
     */
    color?: EpamPrimaryColor | 'gray60' | uui.NotificationCardProps['color'];
}

export type NotificationCardProps = Omit<uui.NotificationCardProps, 'color'> & NotificationCardMods;

export const NotificationCard = withMods<Omit<uui.NotificationCardProps, 'color'>, NotificationCardMods>(
    uui.NotificationCard,
    () => [],
    (props) => ({
        ...props,
        color: props.color ?? null,
    }),
);
