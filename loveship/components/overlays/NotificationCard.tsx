import * as React from 'react';
import cx from 'classnames';
import { INotification, Icon, IHasChildren, IHasCX, IHasRawProps, useUuiContext } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { IconButton } from '../buttons';
import { EpamColor, LinkButton } from '..';
import { i18n } from '../../i18n';
import { ReactComponent as SuccessIcon } from '../icons/notification-check-fill-24.svg';
import { ReactComponent as WarningIcon } from '../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from '../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from '../icons/notification-help-fill-24.svg';
import { ReactComponent as CrossIcon } from '../icons/snackbar/cross.svg';
import styles from '../../assets/styles/scss/loveship-color-vars.scss';
import css from './NotificationCard.scss';

interface NotificationAction extends IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>> {
    name: string;
    action: () => void;
}

export interface DefaultNotificationProps extends INotification, IHasChildren, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    actions?: NotificationAction[];
}

export interface NotificationCardProps extends DefaultNotificationProps {
    icon?: Icon;
    color: EpamColor;
}

export const NotificationCard = React.forwardRef<HTMLDivElement, NotificationCardProps>((props, ref) => {
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
        <div
            role="alert"
            className={ cx(css.notificationWrapper, styles[`color-${ props.color }`], props.cx) }
            ref={ notificationCardNode }
            { ...props.rawProps }
        >
            <div className={ css.mainPath }>
                { props.icon && (
                    <div className={ css.iconWrapper }>
                        <IconContainer icon={ props.icon } cx={ css.actionIcon } />
                    </div>
                ) }
                <div className={ css.content }>
                    { props.children }
                    { props.actions && <div className={ css.actionWrapper }>
                        { props.actions.map(action => (
                            <LinkButton
                                caption={ action.name }
                                onClick={ action.action }
                                key={ action.name }
                                cx={ css.actionLink }
                                size='36'
                                rawProps={ action.rawProps }
                            />
                        )) }
                    </div> }
                </div>
                { props.onClose && (
                    <div className={ css.closeWrapper }>
                        <IconButton
                            icon={ CrossIcon }
                            color='night600'
                            onClick={ props.onClose }
                            cx={ css.closeIcon }
                        />
                    </div>
                ) }
            </div>
        </div>
    );
});

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
