import React from 'react';
import cx from 'classnames';
import { useUuiContext, withMods } from '@epam/uui-core';
import { NotificationCard as uuiNotificationCard, NotificationCardProps as uuiNotificationCardProps, DefaultNotificationProps } from '@epam/uui';
import { EpamPrimaryColor } from '../types';
import { IconButtonProps, LinkButton } from '../buttons';
import { i18n } from '../../i18n';
import { ReactComponent as SuccessIcon } from '../icons/notification-check-fill-24.svg';
import { ReactComponent as WarningIcon } from '../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from '../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from '../icons/notification-help-fill-24.svg';
import css from './NotificationCard.scss';

export interface NotificationCardMods {
    color: EpamPrimaryColor | 'night600';
    closeButtonProps?: IconButtonProps;
}

function applyNotificationCardMods() {
    return [
        'uui-theme-loveship',
    ];
}

export interface NotificationCardProps extends Omit<uuiNotificationCardProps, 'color' | 'closeButtonProps'>, NotificationCardMods {}


export const NotificationCard = withMods<Omit<uuiNotificationCardProps, 'color' | 'closeButtonProps'>, NotificationCardMods>(
    uuiNotificationCard,
    applyNotificationCardMods,
    (props) => ({
        ...props,
        color: props.color ?? 'night600',
        closeButtonProps: {
            ...props.closeButtonProps,
            color: props.closeButtonProps?.color ?? 'night600',
            cx: cx('uui-theme-loveship', props.closeButtonProps?.cx),
        },
    }),
);

export const WarningNotification = React.forwardRef<HTMLDivElement, DefaultNotificationProps>((props, ref) => (
    <NotificationCard icon={ WarningIcon } color='sun' ref={ ref } { ...props } cx={ cx(props.cx, css.typeWarning) } />
));

export const SuccessNotification = React.forwardRef<HTMLDivElement, DefaultNotificationProps>((props, ref) => (
    <NotificationCard icon={ SuccessIcon } ref={ ref } color='grass' { ...props } cx={ cx(props.cx, css.typeSuccess) } />
));

export const HintNotification = React.forwardRef<HTMLDivElement, DefaultNotificationProps>((props, ref) => (
    <NotificationCard icon={ HintIcon } ref={ ref } color='sky' { ...props } cx={ cx(props.cx, css.typeHint) } />
));

export const ErrorNotification = React.forwardRef<HTMLDivElement, DefaultNotificationProps>((props, ref) => (
    <NotificationCard icon={ ErrorIcon } color='fire' ref={ ref } { ...props } cx={ cx(props.cx, css.typeError) } />
));

export const ClearNotification = React.forwardRef<HTMLDivElement, {}>((_, ref) => {
    const context = useUuiContext();

    return (
        <div ref={ ref } className={ cx(css.notificationWrapper, css.clearButton) }>
            <LinkButton
                caption={ i18n.notificationCard.closeAllNotificationsButton }
                onClick={ () => context.uuiNotifications.clearAll() }
            />
        </div>
    );
});
