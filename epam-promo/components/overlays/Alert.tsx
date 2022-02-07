import * as React from 'react';
import { IHasChildren, IHasCX, Icon, IHasRawProps, IHasForwardedRef } from '@epam/uui';
import { IconContainer } from '@epam/uui-components';
import { ReactComponent as SuccessIcon } from '../../icons/notification-check_circle-fill-24.svg';
import { ReactComponent as WarningIcon } from '../../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from '../../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from '../../icons/notification-help-fill-24.svg';
import { ReactComponent as CrossIcon } from '../../icons/navigation-close-24.svg';
import * as styles from '../../assets/styles/colorvars/overlays/alert-colorvars.scss';
import * as css from './Alert.scss';
import { IconButton } from '../buttons';
import cx from 'classnames';
import { EpamPrimaryColor, LinkButton } from '..';

type notificationAction = {
    name: string;
    action: () => void;
};

export interface AlertProps extends IHasChildren, IHasCX, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    actions?: notificationAction[];
    color?: EpamPrimaryColor;
    onClose?(): void;
    icon?: Icon;
}

export class Alert extends React.Component<AlertProps> {
    render() {
        return (
            <div
                role="alert"
                ref={ this.props.forwardedRef }
                className={ cx(css.alertWrapper, styles[`color-${this.props.color || 'blue'}`], css.root, this.props.cx) }
                { ...this.props.rawProps }
            >
                <div className={ css.mainPath }>
                    { this.props.icon && <div className={ css.iconWrapper }>
                        <IconContainer icon={ this.props.icon } cx={ css.actionIcon } />
                    </div> }
                    <div className={ css.content }>
                        { this.props.children }
                        { this.props.actions && <div className={ css.actionWrapper }>
                            { this.props.actions.map(action => (
                                <LinkButton
                                    caption={ action.name }
                                    onClick={ action.action }
                                    key={ action.name }
                                    cx={ css.actionLink }
                                    size='24'
                                />
                            )) }
                        </div> }
                    </div>
                    { this.props.onClose && <IconButton icon={ CrossIcon } color='gray60' onClick={ this.props.onClose } cx={ css.closeIcon } /> }
                </div>
            </div>
        );
    }
}

export const WarningAlert = (props: AlertProps) =>
    <Alert icon={ WarningIcon } color='amber' { ...props } />;
export const SuccessAlert = (props: AlertProps) =>
    <Alert icon={ SuccessIcon } color='green' { ...props }  />;
export const HintAlert = (props: AlertProps) =>
    <Alert icon={ HintIcon } color='blue' { ...props } />;
export const ErrorAlert = (props: AlertProps) =>
    <Alert icon={ ErrorIcon } color='red' { ...props } />;