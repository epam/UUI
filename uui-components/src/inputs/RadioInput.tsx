import * as React from 'react';
import {
    IHasRawProps, cx, IHasCX, IDisableable, IEditable, IHasLabel, Icon, uuiMod, uuiElement, ICanBeReadonly,
    IAnalyticableOnChange, uuiMarkers, IHasForwardedRef, ICanFocus, IHasTabIndex, useUuiContext,
} from '@epam/uui-core';
import { IconContainer } from '../layout/IconContainer';
import css from './RadioInput.module.scss';

export type RadioInputProps = IHasCX & IDisableable & IEditable<boolean> & IHasLabel & ICanBeReadonly & IAnalyticableOnChange<boolean>
& IHasRawProps<React.LabelHTMLAttributes<HTMLLabelElement>> & IHasForwardedRef<HTMLLabelElement> & ICanFocus<HTMLInputElement> & IHasTabIndex & {
    /** Icon for radio input selected state.
     * Usually it has a default implementation in skins, so providing this is only necessary if you want to replace the default icon
     */
    icon?: Icon;
    /** Render callback for checkbox label.
     * If omitted, 'label' prop value will be rendered.
     */
    renderLabel?(): React.ReactNode;
    /** ID to put on 'input' node */
    id?: string;
    /** Defines native HTML name attribute for the input */
    name?: string;
};

export const RadioInput = /* @__PURE__ */React.forwardRef<HTMLLabelElement, RadioInputProps>((props, ref) => {
    const context = useUuiContext();

    const handleChange = () => {
        props.onValueChange(!props.value);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(!props.value, props.value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    return (
        <label
            className={ cx(
                css.container,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                props.isInvalid && uuiMod.invalid,
                props.cx,
                !props.isReadonly && !props.isDisabled && uuiMarkers.clickable,
            ) }
            ref={ ref }
            { ...props.rawProps }
        >
            <div
                className={ cx(uuiElement.radioInput, props.value && uuiMod.checked) }
                onFocus={ props.onFocus }
                onBlur={ props.onBlur }
            >
                <input
                    name={ props.name }
                    type="radio"
                    onChange={ !props.isReadonly ? handleChange : undefined }
                    disabled={ props.isDisabled }
                    aria-disabled={ props.isDisabled || undefined }
                    readOnly={ props.isReadonly }
                    aria-readonly={ props.isReadonly || undefined }
                    required={ props.isRequired }
                    aria-required={ props.isRequired || undefined }
                    checked={ props.value || false }
                    aria-checked={ props.value || false }
                    id={ props.id }
                    tabIndex={ props.tabIndex }
                />
                {props.value && <IconContainer icon={ props.icon } cx={ css.circle } />}
            </div>
            {(props.renderLabel || props.label) && (
                <div className={ uuiElement.inputLabel }>{props.renderLabel ? props.renderLabel() : props.label}</div>
            )}
        </label>
    );
});
