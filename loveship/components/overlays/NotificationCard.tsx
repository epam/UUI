import React from 'react';
import { withMods } from '@epam/uui-core';
import { NotificationCard as uuiNotificationCard, NotificationCardProps as uuiNotificationCardProps } from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export interface NotificationCardMods {
    color: EpamPrimaryColor | 'night600';
}

export type NotificationCardProps = Omit<uuiNotificationCardProps, 'color'> & NotificationCardMods;

export const NotificationCard = withMods<Omit<uuiNotificationCardProps, 'color'>, NotificationCardMods>(
    uuiNotificationCard,
    () => [],
    (props) => ({
        ...props,
        color: props.color ?? null,
    }),
);
