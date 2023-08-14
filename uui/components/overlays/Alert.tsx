import * as React from 'react';
import cx from 'classnames';
import { IHasChildren, IHasCX, Icon, IHasRawProps } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { IconButton, LinkButton } from '../buttons';
import { SemanticColor } from '../types';
import { ReactComponent as SuccessIcon } from '../../icons/notification-check_circle-fill-24.svg';
import { ReactComponent as WarningIcon } from '../../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from '../../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from '../../icons/notification-help-fill-24.svg';
import { ReactComponent as CrossIcon } from '../../icons/navigation-close-24.svg';
import css from './Alert.module.scss';

type notificationAction = {
    name: string;
    action: () => void;
};

export interface AlertProps extends IHasChildren, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** List of actions to display in the alert. Each action has name and 'action' callback */
    actions?: notificationAction[];
    /** Alert color */
    color?: SemanticColor;
    /** When specified, a close icon is rendered. onClose callback will be called on clicking the close icon */
    onClose?(): void;
    /** An optional icon to show on the left of the alert */
    icon?: Icon;
    /** Component size. If omitted, 48 size will be used. */
    size?: '36' | '48';
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <div role="alert" ref={ ref } className={ cx(css.alertWrapper, `alert-${props.color || 'default'}`, css.root, props.cx, (props.size === '36' ? css.size36 : css.size48)) } { ...props.rawProps }>
        <div className={ css.mainPath }>
            {props.icon && (
                <div className={ css.iconWrapper }>
                    <IconContainer icon={ props.icon } cx={ css.actionIcon } />
                </div>
            )}
            <div className={ css.content }>
                {props.children}
                {props.actions && (
                    <div className={ css.actionWrapper }>
                        {props.actions.map((action) => (
                            <LinkButton caption={ action.name } onClick={ action.action } key={ action.name } cx={ css.actionLink } size={ props?.size === '36' ? '24' : '30' } />
                        ))}
                    </div>
                )}
            </div>
            {props.onClose && <IconButton icon={ CrossIcon } color="default" onClick={ props.onClose } cx={ css.closeIcon } />}
        </div>
    </div>
));

export const WarningAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => <Alert icon={ WarningIcon } color="warning" ref={ ref } { ...props } />);

export const SuccessAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => <Alert icon={ SuccessIcon } color="success" ref={ ref } { ...props } />);

export const HintAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => <Alert icon={ HintIcon } color="info" ref={ ref } { ...props } />);

export const ErrorAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => <Alert icon={ ErrorIcon } color="error" ref={ ref } { ...props } />);
