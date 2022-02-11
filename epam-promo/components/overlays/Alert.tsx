import * as React from 'react';
import { IHasChildren, IHasCX, Icon, IHasRawProps } from '@epam/uui';
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

export interface AlertProps extends IHasChildren, IHasCX, IHasRawProps<HTMLDivElement> {
    actions?: notificationAction[];
    color?: EpamPrimaryColor;
    onClose?(): void;
    icon?: Icon;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <div
        role="alert"
        ref={ ref }
        className={ cx(css.alertWrapper, styles[`color-${props.color || 'blue'}`], css.root, props.cx) }
        { ...props.rawProps }
    >
        <div className={ css.mainPath }>
            { props.icon && <div className={ css.iconWrapper }>
                <IconContainer icon={ props.icon } cx={ css.actionIcon } />
            </div> }
            <div className={ css.content }>
                { props.children }
                { props.actions && <div className={ css.actionWrapper }>
                    { props.actions.map(action => (
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
            { props.onClose && <IconButton icon={ CrossIcon } color='gray60' onClick={ props.onClose } cx={ css.closeIcon } /> }
        </div>
    </div>
));

export const WarningAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <Alert icon={ WarningIcon } color='amber' ref={ ref } { ...props } />
));

export const SuccessAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <Alert icon={ SuccessIcon } color='green' ref={ ref } { ...props } />
));

export const HintAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <Alert icon={ HintIcon } color='blue' ref={ ref} { ...props } />
));

export const ErrorAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <Alert icon={ ErrorIcon } color='red' ref={ ref } { ...props } />
));