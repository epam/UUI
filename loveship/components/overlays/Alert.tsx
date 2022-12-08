import * as React from 'react';
import cx from 'classnames';
import { Icon, IHasChildren, IHasCX, IHasRawProps } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { EpamPrimaryColor } from '../types';
import { IconButton, LinkButton } from '../buttons';
import { ReactComponent as SuccessIcon } from './../icons/notification-check-fill-24.svg';
import { ReactComponent as WarningIcon } from './../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from './../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from './../icons/notification-help-fill-24.svg';
import { ReactComponent as CrossIcon } from '../icons/navigation-close-24.svg';
import css from './Alert.scss';

type notificationAction = {
    name: string;
    action: () => void;
};

export interface AlertProps extends IHasChildren, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    actions?: notificationAction[];
    color?: EpamPrimaryColor;
    onClose?(): void;
    icon?: Icon;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <div
        role="alert"
        ref={ ref }
        className={ cx(css.alertWrapper, css[`color-${props.color || 'sky'}`], props.cx) }
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
                            fontSize='14'
                        />
                    )) }
                </div> }
            </div>
        </div>
        { props.onClose && <IconButton icon={ CrossIcon } color='night600' onClick={ props.onClose } cx={ css.closeIcon } /> }
    </div>
));

export const WarningAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) =>
    <Alert icon={ WarningIcon } color='sun' ref={ ref } { ...props } />,
);

export const SuccessAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) =>
    <Alert icon={ SuccessIcon } color='grass' ref={ ref } { ...props } />,
);

export const HintAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) =>
    <Alert icon={ HintIcon } color='sky' ref={ ref } { ...props } />,
);

export const ErrorAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) =>
    <Alert icon={ ErrorIcon } color='fire' ref={ ref } { ...props } />,
);
