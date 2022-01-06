import * as React from 'react';
import { INotification, Icon, IHasChildren, IHasCX, UuiContext, UuiContexts, IHasRawProps } from '@epam/uui';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import { IconContainer } from '@epam/uui-components';
import { IconButton } from '../buttons';
import { ReactComponent as SuccessIcon } from '../icons/notification-check-fill-24.svg';
import { ReactComponent as WarningIcon } from '../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from '../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from '../icons/notification-help-fill-24.svg';
import { ReactComponent as CrossIcon } from '../icons/snackbar/cross.svg';
import * as css from './NotificationCard.scss';
import cx from 'classnames';
import { EpamColor, LinkButton } from '..';
import { i18n } from '../../i18n';

interface NotificationAction extends IHasRawProps<HTMLButtonElement> {
    name: string;
    action: () => void;
};

export interface DefaultNotificationProps extends INotification, IHasChildren, IHasCX, IHasRawProps<HTMLDivElement> {
    actions?: NotificationAction[];
}

export interface NotificationCardProps extends DefaultNotificationProps {
    icon?: Icon;
    color: EpamColor;
}

export function NotificationCard(props: NotificationCardProps) {
    const notificationCardNode = React.useRef(null);

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
                    <IconButton
                        icon={ CrossIcon }
                        color='night600'
                        onClick={ props.onClose }
                        cx={ css.closeIcon }
                    />
                )}
            </div>
        </div>
    );
}

export const WarningNotification = (props: DefaultNotificationProps) => <NotificationCard icon={ WarningIcon } color='sun' { ...props } cx={ cx(props.cx, css.typeWarning) } />;
export const SuccessNotification = (props: DefaultNotificationProps) => <NotificationCard icon={ SuccessIcon } color='grass' { ...props } cx={ cx(props.cx, css.typeSuccess) } />;
export const HintNotification = (props: DefaultNotificationProps) => <NotificationCard icon={ HintIcon } color='sky' { ...props } cx={ cx(props.cx, css.typeHint) } />;
export const ErrorNotification = (props: DefaultNotificationProps) => <NotificationCard icon={ ErrorIcon } color='fire' { ...props } cx={ cx(props.cx, css.typeError) } />;

export class ClearNotification extends React.Component<{}> {
    public static contextType = UuiContext;
    public context: UuiContexts;

    render() {
        return <div className={ cx(css.notificationWrapper, css.clearButton) }><LinkButton caption={ i18n.notificationCard.closeAllNotificationsButton } onClick={ () => this.context.uuiNotifications.clearAll() } /></div>;
    }
}
