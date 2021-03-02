import React from 'react';
import cx from 'classnames';
import {Icon, IHasChildren, IHasCX} from '@epam/uui';
import { IconContainer } from '@epam/uui-components';
import { EpamPrimaryColor } from '../types';
import { IconButton, LinkButton } from '../buttons';
import * as successIcon from './../icons/notification-check-fill-24.svg';
import * as warningIcon from './../icons/notification-warning-fill-24.svg';
import * as errorIcon from './../icons/notification-error-fill-24.svg';
import * as hintIcon from './../icons/notification-help-fill-24.svg';
import * as crossIcon from '../icons/navigation-close-24.svg';
import * as css from './Alert.scss';

type notificationAction = {
    name: string;
    action: () => void;
};

export interface AlertProps extends IHasChildren, IHasCX {
    actions?: notificationAction[];
    color?: EpamPrimaryColor;
    onClose?(): void;
    icon?: Icon;
}

export class Alert extends React.Component<AlertProps> {

    render() {

        return <div className={ cx(css.alertWrapper, css[`color-${this.props.color || 'sky'}`], this.props.cx) }>
            <div className={ css.mainPath }>
                { this.props.icon && <div className={ css.iconWrapper }>
                    <IconContainer icon={ this.props.icon } cx={ css.actionIcon } />
                </div> }
                <div className={ css.content }>
                    { this.props.children }
                    { this.props.actions && <div className={ css.actionWrapper }>
                        { this.props.actions.map((action: notificationAction) => {
                            return <LinkButton caption={ action.name } onClick={ action.action } key={ action.name } cx={ css.actionLink } size='24' fontSize='14' />;
                        }) }
                    </div> }
                </div>
            </div>
            { this.props.onClose && <IconButton icon={ crossIcon } color='night600' onClick={ this.props.onClose } cx={ css.closeIcon } /> }
        </div>;
    }
}

export const WarningAlert = (props: AlertProps) =>
    <Alert icon={ warningIcon } color='sun' { ...props } />;
export const SuccessAlert = (props: AlertProps) =>
    <Alert icon={ successIcon } color='grass' { ...props } />;
export const HintAlert = (props: AlertProps) =>
    <Alert icon={ hintIcon } color='sky' { ...props } />;
export const ErrorAlert = (props: AlertProps) =>
    <Alert icon={ errorIcon } color='fire' { ...props } />;