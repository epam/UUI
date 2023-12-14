import { withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export interface NotificationCardMods {
    color: EpamPrimaryColor | 'night600' | uui.NotificationCardProps['color'];
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
