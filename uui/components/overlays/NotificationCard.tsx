import React from 'react';
import cx from 'classnames';
import { IconContainer } from '@epam/uui-components';
import { INotification, Icon, IHasChildren, IHasCX, UuiContext, UuiContexts, IHasRawProps } from '@epam/uui-core';
import { IconButton, LinkButton } from '../buttons';
import { SemanticColor } from '../types';
import { i18n } from '../../i18n';
import { ReactComponent as SuccessIcon } from '../../icons/notification-check_circle-fill-24.svg';
import { ReactComponent as WarningIcon } from '../../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from '../../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from '../../icons/notification-help-fill-24.svg';
import { ReactComponent as CrossIcon } from '../../icons/snackbar/cross.svg';
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
    color?: SemanticColor;
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
            className={ cx(props.color && `notification-card-${ props.color }`, css.root, props.cx) }
            ref={ notificationCardNode }
            { ...props.rawProps }
        >
            <div className={ css.mainPath }>
                { props.icon && (
                    <div className={ css.iconWrapper }>
                        <IconContainer icon={ props.icon } cx={ css.actionIcon }/>
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
                                size="36"
                                rawProps={ action.rawProps }
                            />
                        )) }
                    </div> }
                </div>
                { props.onClose && (
                    <div className={ css.closeWrapper }>
                        <IconButton
                            icon={ CrossIcon }
                            color={ 'default' }
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
    <NotificationCard icon={ WarningIcon } color="warning" { ...props } ref={ ref } cx={ props.cx }/>
));

export const SuccessNotification = React.forwardRef<HTMLDivElement, DefaultNotificationProps>((props, ref) => (
    <NotificationCard icon={ SuccessIcon } color="success" { ...props } ref={ ref } cx={ props.cx }/>
));

export const HintNotification = React.forwardRef<HTMLDivElement, DefaultNotificationProps>((props, ref) => (
    <NotificationCard icon={ HintIcon } color="info" { ...props } ref={ ref } cx={ props.cx }/>
));

export const ErrorNotification = React.forwardRef<HTMLDivElement, DefaultNotificationProps>((props, ref) => (
    <NotificationCard icon={ ErrorIcon } color="error" { ...props } ref={ ref } cx={ props.cx }/>
));

export class ClearNotification extends React.Component<{}> {
    public static contextType = UuiContext;
    public context: UuiContexts;

    render() {
        return <div className={ cx(css.notificationWrapper, css.clearButton) }>
            <LinkButton
                caption={ i18n.notificationCard.closeAllNotificationsButton }
                onClick={ () => this.context.uuiNotifications.clearAll() }
            />
        </div>;
    }
}
