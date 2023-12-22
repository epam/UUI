import * as React from 'react';
import { EpamPrimaryColor } from '../types';
import * as uui from '@epam/uui';
import { createSkinComponent } from '@epam/uui-core';
import { ReactComponent as SuccessIcon } from './../icons/notification-check-fill-24.svg';
import { ReactComponent as WarningIcon } from './../icons/notification-warning-fill-24.svg';
import { ReactComponent as ErrorIcon } from './../icons/notification-error-fill-24.svg';
import { ReactComponent as HintIcon } from './../icons/notification-help-fill-24.svg';

interface AlertMods {
    /**
     * Defines component color.
     * @default 'sky'
     */
    color?: EpamPrimaryColor | uui.AlertProps['color'];
}

/** Represents the properties of the Alert component. */
export interface AlertProps extends uui.AlertCoreProps, AlertMods {}

export const Alert = createSkinComponent<uui.AlertProps, AlertProps>(
    uui.Alert,
    (props) => ({
        ...props,
        color: props.color ?? 'sky',
    }),
);

export const WarningAlert = React.forwardRef<HTMLDivElement, Omit<AlertProps, 'color'>>((props, ref) => <Alert icon={ WarningIcon } color="sun" ref={ ref } { ...props } />);

export const SuccessAlert = React.forwardRef<HTMLDivElement, Omit<AlertProps, 'color'>>((props, ref) => <Alert icon={ SuccessIcon } color="grass" ref={ ref } { ...props } />);

export const HintAlert = React.forwardRef<HTMLDivElement, Omit<AlertProps, 'color'>>((props, ref) => <Alert icon={ HintIcon } color="sky" ref={ ref } { ...props } />);

export const ErrorAlert = React.forwardRef<HTMLDivElement, Omit<AlertProps, 'color'>>((props, ref) => <Alert icon={ ErrorIcon } color="fire" ref={ ref } { ...props } />);
