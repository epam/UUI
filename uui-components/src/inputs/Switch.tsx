import * as React from 'react';
import {
    cx, IHasRawProps, uuiMod, uuiElement, IHasCX, IDisableable, IEditable, IHasLabel, uuiMarkers,
    IAnalyticableOnChange, IHasForwardedRef, IHasTabIndex, ICanFocus, useUuiContext,
} from '@epam/uui-core';
import css from './Switch.module.scss';

export interface SwitchProps
    extends IHasCX,
    IDisableable,
    Omit<IEditable<boolean>, 'isInvalid'>,
    IHasLabel,
    IAnalyticableOnChange<boolean>,
    IHasRawProps<React.LabelHTMLAttributes<HTMLLabelElement>>,
    IHasForwardedRef<HTMLLabelElement>,
    IHasTabIndex,
    ICanFocus<HTMLInputElement> {
    /** ID to put on 'input' node */
    id?: string;
}

export const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>((props, ref) => {
    const context = useUuiContext();

    const toggle = () => {
        props.onValueChange(!props.value);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(!props.value, props.value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    return (
        <label
            className={ cx(
                'uui-switch',
                css.container,
                props.cx,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                !props.isReadonly && !props.isDisabled && uuiMarkers.clickable,
            ) }
            ref={ ref }
            { ...props.rawProps }
        >
            <div
                className={ cx(uuiElement.switchBody, props.value && uuiMod.checked) }
                onFocus={ props.onFocus }
                onBlur={ props.onBlur }
            >
                <input
                    type="checkbox"
                    role="switch"
                    onChange={ !props.isReadonly ? toggle : undefined }
                    readOnly={ props.isReadonly }
                    aria-readonly={ props.isReadonly || undefined }
                    disabled={ props.isDisabled }
                    aria-disabled={ props.isDisabled }
                    checked={ props.value || false }
                    aria-checked={ props.value || false }
                    required={ props.isRequired }
                    tabIndex={ props.tabIndex }
                    id={ props.id }
                />
                <div className={ uuiElement.switchToggler } />
            </div>
            {props.label && <div className={ uuiElement.inputLabel }>{props.label}</div>}
        </label>
    );
});
