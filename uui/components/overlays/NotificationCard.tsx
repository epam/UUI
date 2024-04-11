import React from 'react';
import cx from 'classnames';
import { IconContainer } from '@epam/uui-components';
import { INotification, Icon, IHasChildren, IHasCX, UuiContext, UuiContexts, IHasRawProps } from '@epam/uui-core';
import { IconButton, LinkButton } from '../buttons';
import { i18n } from '../../i18n';
import { ReactComponent as SuccessIcon } from '@epam/assets/icons/notification-check-fill.svg';
import { ReactComponent as WarningIcon } from '@epam/assets/icons/notification-warning-fill.svg';
import { ReactComponent as ErrorIcon } from '@epam/assets/icons/notification-error-fill.svg';
import { ReactComponent as HintIcon } from '@epam/assets/icons/notification-help-fill.svg';
import { ReactComponent as CrossIcon } from '@epam/assets/icons/navigation-close-outline.svg';
import css from './NotificationCard.module.scss';

interface NotificationAction extends IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>> {
    /** Defines NotificationAction name. */
    name: string;
    /** Called when action is clicked */
    action: () => void;
}

export interface NotificationCardCoreProps extends INotification, IHasChildren, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
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

export const NotificationCard = /* @__PURE__ */React.forwardRef<HTMLDivElement, NotificationCardProps>((props, ref) => {
    const notificationCardNode = React.useRef(null);

    React.useImperativeHandle(ref, () => notificationCardNode.current, [notificationCardNode.current]);

    React.useLayoutEffect(() => {
        notificationCardNode.current?.addEventListener('mouseenter', props.clearTimer);
        notificationCardNode.current?.addEventListener('mouseleave', props.refreshTimer);
        return () => {
            notificationCardNode.current?.removeEventListener('mouseenter', props.clearTimer);
            notificationCardNode.current?.removeEventListener('mouseleave', props.refreshTimer);
        };
    }, []);

    return (
        <div role="alert" className={ cx('uui-notification_card', props.color && `uui-color-${props.color}`, css.root, props.cx) } ref={ notificationCardNode } { ...props.rawProps }>
            <div className={ css.mainPath }>
                {props.icon && (
                    <div className={ css.iconWrapper }>
                        <IconContainer size={ 24 } icon={ props.icon } />
                    </div>
                )}
                <div className={ css.content }>
                    {props.children}
                    {props.actions && (
                        <div className={ css.actionWrapper }>
                            {props.actions.map((action) => (
                                <LinkButton caption={ action.name } onClick={ action.action } key={ action.name } cx={ css.actionLink } size="36" rawProps={ action.rawProps } />
                            ))}
                        </div>
                    )}
                </div>
                {props.onClose && (
                    <div className={ css.closeWrapper }>
                        <IconButton icon={ CrossIcon } color="neutral" onClick={ props.onClose } cx={ css.closeIcon } />
                    </div>
                )}
            </div>
        </div>
    );
});

export const WarningNotification = /* @__PURE__ */React.forwardRef<HTMLDivElement, NotificationCardCoreProps>((props, ref) => (
    <NotificationCard icon={ WarningIcon } color="warning" { ...props } ref={ ref } cx={ props.cx } />
));

export const SuccessNotification = /* @__PURE__ */React.forwardRef<HTMLDivElement, NotificationCardCoreProps>((props, ref) => (
    <NotificationCard icon={ SuccessIcon } color="success" { ...props } ref={ ref } cx={ props.cx } />
));

export const HintNotification = /* @__PURE__ */React.forwardRef<HTMLDivElement, NotificationCardCoreProps>((props, ref) => (
    <NotificationCard icon={ HintIcon } color="info" { ...props } ref={ ref } cx={ props.cx } />
));

export const ErrorNotification = /* @__PURE__ */React.forwardRef<HTMLDivElement, NotificationCardCoreProps>((props, ref) => (
    <NotificationCard icon={ ErrorIcon } color="error" { ...props } ref={ ref } cx={ props.cx } />
));

export class ClearNotification extends React.Component<{}> {
    public static contextType = UuiContext;
    public context: UuiContexts;
    render() {
        return (
            <div className={ cx(css.notificationWrapper, css.clearButton) }>
                <LinkButton caption={ i18n.notificationCard.closeAllNotificationsButton } onClick={ () => this.context.uuiNotifications.clearAll() } />
            </div>
        );
    }
}
