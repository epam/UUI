import React from 'react';
import cx from 'classnames';
import { IconContainer } from '@epam/uui-components';
import { INotification, Icon, IHasChildren, IHasCX, UuiContext, UuiContexts } from '@epam/uui-core';
import { IconButton, LinkButton } from '../buttons';
import { i18n } from '../../i18n';
import { ReactComponent as SuccessIcon } from '../../icons/notification-check_circle-fill-24.svg';
import { ReactComponent as WarningIcon } from '../../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from '../../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from '../../icons/notification-help-fill-24.svg';
import { ReactComponent as CrossIcon } from '../../icons/snackbar/cross.svg';
import '../../assets/styles/variables/overlays/notificationCard.scss';
import css from './NotificationCard.scss';

type notificationAction = {
    name: string;
    action: () => void;
};

export interface DefaultNotificationProps extends INotification, IHasChildren, IHasCX {
    actions?: notificationAction[];
}

export interface NotificationCardProps extends DefaultNotificationProps {
    icon?: Icon;
    color: 'info' | 'success' | 'warning' | 'error';
}

export class NotificationCard extends React.Component<NotificationCardProps> {
    notificationCardNode: HTMLElement | null = null;

    componentDidMount() {
        this.notificationCardNode?.addEventListener('mouseenter', this.props.clearTimer);
        this.notificationCardNode?.addEventListener('mouseleave', this.props.refreshTimer);
    }

    componentWillUnmount() {
        this.notificationCardNode?.removeEventListener('mouseenter', this.props.clearTimer);
        this.notificationCardNode?.removeEventListener('mouseleave', this.props.refreshTimer);
    }

    render() {
        return (
            <div
                role="alert"
                className={cx(
                    css.notificationWrapper,
                    'notification-card-vars',
                    `notification-card-color-${this.props.color}`,
                    css.root,
                    this.props.cx
                )}
                ref={el => (this.notificationCardNode = el)}
            >
                <div className={css.mainPath}>
                    {this.props.icon && (
                        <div className={css.iconWrapper}>
                            <IconContainer icon={this.props.icon} cx={css.actionIcon} />
                        </div>
                    )}
                    <div className={css.content}>
                        {this.props.children}
                        {this.props.actions && (
                            <div className={css.actionWrapper}>
                                {this.props.actions.map((action: notificationAction) => {
                                    return (
                                        <LinkButton caption={action.name} onClick={action.action} key={action.name} cx={css.actionLink} size="36" />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {this.props.onClose && (
                        <div className={css.closeWrapper}>
                            <IconButton icon={CrossIcon} color="default" onClick={this.props.onClose} cx={css.closeIcon} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export const WarningNotification = (props: DefaultNotificationProps) => (
    <NotificationCard icon={WarningIcon} color="warning" {...props} cx={cx(props.cx)} />
);
export const SuccessNotification = (props: DefaultNotificationProps) => (
    <NotificationCard icon={SuccessIcon} color="success" {...props} cx={cx(props.cx)} />
);
export const HintNotification = (props: DefaultNotificationProps) => <NotificationCard icon={HintIcon} color="info" {...props} cx={cx(props.cx)} />;
export const ErrorNotification = (props: DefaultNotificationProps) => (
    <NotificationCard icon={ErrorIcon} color="error" {...props} cx={cx(props.cx)} />
);

export class ClearNotification extends React.Component<{}> {
    public static contextType = UuiContext;
    public context: UuiContexts;

    render() {
        return (
            <div className={cx(css.notificationWrapper, css.clearButton)}>
                <LinkButton caption={i18n.notificationCard.closeAllNotificationsButton} onClick={() => this.context.uuiNotifications.clearAll()} />
            </div>
        );
    }
}
