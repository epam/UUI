import * as React from 'react';
import cx from 'classnames';
import { IHasChildren, IHasCX, Icon, IHasRawProps, Overwrite } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { IconButton, LinkButton } from '../buttons';
import { settings } from '../../settings';

import css from './Alert.module.scss';

interface AlertNotificationAction {
    /*
    * Defines notification action name.
    */
    name: string;
    /*
    * Called when action is clicked
    */
    action: () => void;
}

interface AlertMods {
    /** Alert color */
    color: 'info' | 'success' | 'warning' | 'error';
}

export interface AlertModsOverride {}

export interface AlertCoreProps extends IHasChildren, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, React.RefAttributes<HTMLDivElement> {
    /** List of actions to display in the alert. Each action has name and 'action' callback */
    actions?: AlertNotificationAction[];
    /** When specified, a close icon is rendered. onClose callback will be called on clicking the close icon */
    onClose?(): void;
    /** An optional icon to show on the left of the alert */
    icon?: Icon;
    /**
     * Component size. If omitted, 48 size will be used.
     * @default '48'
     */
    size?: '36' | '48';
}

/** Represents the properties of the Alert component. */
export interface AlertProps extends AlertCoreProps, Overwrite<AlertMods, AlertModsOverride> {}

export function Alert(props: AlertProps) {
    return (
        <div
            role="alert"
            ref={ props.ref }
            className={
                cx(
                    'uui-alert',
                    css.root,
                    props.color && `uui-color-${props.color}`,
                    props.cx,
                    `uui-size-${props.size || settings.alert.sizes.default}`,
                )
            }
            { ...props.rawProps }
        >
            <div className={ css.mainPath }>
                <div className={ css.contentWrapper }>
                    {props.icon && (
                        <div className={ css.iconWrapper }>
                            <IconContainer icon={ props.icon } cx={ css.icon } />
                        </div>
                    )}
                    <div className={ css.content }>
                        {props.children}
                        {props.actions && (
                            <div className={ css.actionWrapper }>
                                {props.actions.map((action) => (
                                    <LinkButton
                                        caption={ action.name }
                                        onClick={ action.action }
                                        key={ action.name }
                                        cx={ css.actionLink }
                                        size={ settings.alert.sizes.actionMap[props.size || settings.alert.sizes.default] }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {props.onClose && <IconButton icon={ settings.alert.icons.closeIcon } color="neutral" onClick={ props.onClose } cx={ css.closeIcon } />}
            </div>
        </div>
    );
}

export function WarningAlert(props: Omit<AlertProps, 'color'>) {
    return <Alert icon={ settings.alert.icons.warningIcon } color="warning" { ...props } />;
}

export function SuccessAlert(props: Omit<AlertProps, 'color'>) {
    return <Alert icon={ settings.alert.icons.successIcon } color="success" { ...props } />;
}

export function HintAlert(props: Omit<AlertProps, 'color'>) {
    return <Alert icon={ settings.alert.icons.infoIcon } color="info" { ...props } />;
}

export function ErrorAlert(props: Omit<AlertProps, 'color'>) {
    return <Alert icon={ settings.alert.icons.errorIcon } color="error" { ...props } />;
}
