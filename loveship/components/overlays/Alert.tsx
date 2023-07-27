import * as React from 'react';
import { AlertProps as uuiAlertProps, Alert as uuiAlert } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { ReactComponent as SuccessIcon } from './../icons/notification-check-fill-24.svg';
import { ReactComponent as WarningIcon } from './../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from './../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from './../icons/notification-help-fill-24.svg';
import { EpamPrimaryColor } from '../types';

export interface AlertMods {
    color?: EpamPrimaryColor;
}

export interface AlertProps extends Omit<uuiAlertProps, 'color'>, AlertMods {}

export const Alert = withMods<Omit<uuiAlertProps, 'color'>, AlertMods>(
    uuiAlert,
    () => [],
    (props) => ({
        ...props,
        color: props.color ?? 'sky',
        size: props.size ?? '48',
    }),
);

export const WarningAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => <Alert icon={ WarningIcon } color="sun" ref={ ref } { ...props } />);

export const SuccessAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => <Alert icon={ SuccessIcon } color="grass" ref={ ref } { ...props } />);

export const HintAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => <Alert icon={ HintIcon } color="sky" ref={ ref } { ...props } />);

export const ErrorAlert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => <Alert icon={ ErrorIcon } color="fire" ref={ ref } { ...props } />);
