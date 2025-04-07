import React from 'react';
import cx from 'classnames';
import { IconContainer } from '@epam/uui-components';
import {
    INotification,
    Icon,
    IHasChildren,
    IHasCX,
    IHasRawProps,
    useUuiContext,
} from '@epam/uui-core';
import { IconButton, LinkButton } from '../buttons';
import { i18n } from '../../i18n';
import { settings } from '../../settings';

import css from './NotificationCard.module.scss';

interface NotificationAction extends IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>> {
    /** Defines NotificationAction name. */
    name: string;
    /** Called when action is clicked */
    action: () => void;
}

export interface NotificationCardCoreProps extends INotification, IHasChildren, IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, Pick<React.RefAttributes<HTMLDivElement>, 'ref'> {
    /** Array of Notification actions. If provided will be displayed as LinkButtons in the end of notification. */
    actions?: NotificationAction[];
    /** NotificationCard icon */
    icon?: Icon;
}

interface NotificationMods {
    /** NotificationCard color */
    color?: 'info' | 'success' | 'warning' | 'error';
}

export interface NotificationCardProps extends NotificationCardCoreProps, NotificationMods {}

export function NotificationCard(props: NotificationCardProps) {
    const notificationCardNode = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(props.ref, () => notificationCardNode.current, [notificationCardNode.current]);

    React.useLayoutEffect(() => {
        notificationCardNode.current?.addEventListener('mouseenter', props.clearTimer);
        notificationCardNode.current?.addEventListener('mouseleave', props.refreshTimer);
        return () => {
            notificationCardNode.current?.removeEventListener('mouseenter', props.clearTimer);
            notificationCardNode.current?.removeEventListener('mouseleave', props.refreshTimer);
        };
    }, []);

    return (
        <div
            role="alert"
            className={ cx('uui-notification_card', props.color && `uui-color-${props.color}`, css.root, props.cx) }
            ref={ notificationCardNode }
            { ...props.rawProps }
        >
            <div className={ css.mainPath }>
                { props.icon && (
                    <div className={ css.iconWrapper }>
                        <IconContainer size={ 24 } icon={ props.icon } />
                    </div>
                ) }
                <div className={ css.content }>
                    { props.children }
                    { props.actions && (
                        <div className={ css.actionWrapper }>
                            { props.actions.map((action) => (
                                <LinkButton
                                    key={ action.name }
                                    caption={ action.name }
                                    onClick={ action.action }
                                    cx={ css.actionLink }
                                    size={ settings.notificationCard.sizes.action }
                                    rawProps={ action.rawProps }
                                />
                            )) }
                        </div>
                    ) }
                </div>
                { props.onClose && (
                    <div className={ css.closeWrapper }>
                        <IconButton icon={ settings.notificationCard.icons.closeIcon } color="neutral" onClick={ props.onClose } cx={ css.closeIcon } />
                    </div>
                ) }
            </div>
        </div>
    );
}

export function WarningNotification(props: NotificationCardProps) {
    return <NotificationCard icon={ settings.notificationCard.icons.warningIcon } color="warning" { ...props } />;
}

export function SuccessNotification(props: NotificationCardProps) {
    return <NotificationCard icon={ settings.notificationCard.icons.successIcon } color="success" { ...props } />;
}

export function HintNotification(props: NotificationCardProps) {
    return <NotificationCard icon={ settings.notificationCard.icons.hintIcon } color="info" { ...props } />;
}

export function ErrorNotification(props: NotificationCardProps) {
    return <NotificationCard icon={ settings.notificationCard.icons.errorIcon } color="error" { ...props } />;
}

export function ClearNotification() {
    const uuiCtx = useUuiContext();
    return (
        <div className={ cx(css.notificationWrapper, css.clearButton) }>
            <LinkButton
                caption={ i18n.notificationCard.closeAllNotificationsButton }
                onClick={ () => uuiCtx.uuiNotifications.clearAll() }
            />
        </div>
    );
}
