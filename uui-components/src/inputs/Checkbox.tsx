import * as React from 'react';
import { cx, IHasTabIndex, useUuiContext, uuiMarkers } from '@epam/uui-core';
import { Icon, uuiMod, uuiElement, isEventTargetInsideClickable, CheckboxCoreProps } from '@epam/uui-core';
import { IconContainer } from '../layout';
import css from './Checkbox.module.scss';

export interface CheckboxProps extends CheckboxCoreProps, IHasTabIndex {
    /** Render callback for checkbox label.
     * If omitted, 'label' prop value will be rendered.
     */
    renderLabel?(): React.ReactNode;

    /** ID to put on 'input' node */
    id?: string;

    /** Check icon.
     * Usually it has a default implementation in skins, so providing this is only necessary if you want to replace the default icon
     */
    icon?: Icon;

    /** Indeterminate state icon.
     * Usually it has a default implementation in skins, so providing this is only necessary if you want to replace the default icon
     */
    indeterminateIcon?: Icon;
}

export const Checkbox = /* @__PURE__ */React.forwardRef<HTMLLabelElement, CheckboxProps>((props, ref) => {
    const context = useUuiContext();

    const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        !isEventTargetInsideClickable(e) && props.onValueChange(!props.value);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(!props.value, props.value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleAriaCheckedValue = (indeterminate: boolean, value: boolean): boolean | 'mixed' => {
        if (indeterminate) {
            return 'mixed';
        }

        return value == null ? false : value;
    };

    const label = props.renderLabel ? props.renderLabel() : props.label;
    const ariaCheckedValue = handleAriaCheckedValue(props.indeterminate, props.value);

    return (
        <label
            className={ cx(
                css.container,
                uuiElement.checkboxContainer,
                props.cx,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                props.isInvalid && uuiMod.invalid,
                !props.isReadonly && !props.isDisabled && uuiMarkers.clickable,
            ) }
            ref={ ref }
            { ...props.rawProps }
        >
            <div
                className={ cx(uuiElement.checkbox, (props.value || props.indeterminate) && uuiMod.checked) }
                onFocus={ props.onFocus }
                onBlur={ props.onBlur }
            >
                <input
                    type="checkbox"
                    onChange={ !props.isReadonly ? handleChange : undefined }
                    disabled={ props.isDisabled }
                    aria-disabled={ props.isDisabled || undefined }
                    readOnly={ props.isReadonly }
                    aria-readonly={ props.isReadonly || undefined }
                    checked={ props.value || false }
                    aria-checked={ ariaCheckedValue }
                    required={ props.isRequired }
                    aria-required={ props.isRequired || undefined }
                    tabIndex={ props.tabIndex || props.isReadonly || props.isDisabled ? -1 : 0 }
                    id={ props.id }
                />
                { props.value && !props.indeterminate && <IconContainer icon={ props.icon } /> }
                { props.indeterminate && <IconContainer icon={ props.indeterminateIcon } /> }
            </div>
            { label && <div className={ uuiElement.inputLabel }>{ label }</div> }
        </label>
    );
});
