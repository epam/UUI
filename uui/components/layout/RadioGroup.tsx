import { cx, directionMode, ICanBeReadonly, ICanFocus, IDisableable, IEditable, IHasCX, IHasDirection, IHasForwardedRef, IHasRawProps } from '@epam/uui-core';
import { RadioInput, RadioInputProps } from '../inputs';
import css from './RadioGroup.module.scss';
import * as React from 'react';

export interface RadioGroupItem<TValue> extends IDisableable, Omit<RadioInputProps, 'id' | 'onValueChange' | 'value' | 'name'> {
    /** RadioInput label. Can be a string, or React.ReactNode */
    name?: React.ReactNode;
    /** Render callback for checkbox label
     * If omitted, 'name' prop value will be rendered
     */
    renderName?: () => React.ReactNode;
    /** Item ID to put into selection */
    id: TValue;
}

export interface RadioGroupProps<TValue>
    extends IHasCX,
    IEditable<TValue>,
    IDisableable,
    IHasDirection,
    ICanBeReadonly,
    IHasRawProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>>,
    IHasForwardedRef<HTMLFieldSetElement>,
    ICanFocus<HTMLFieldSetElement> {
    /** Array of checkbox items to be rendered in group */
    items: RadioGroupItem<TValue>[];
    /** Defines group components size */
    size?: RadioInputProps['size'];
    /** Defines native HTML name attribute for each group member */
    name?: string;
}

export function RadioGroup<TValue>(props: RadioGroupProps<TValue>) {
    const direction = props.direction || 'vertical';

    const handleChange = (newVal: TValue) => {
        if (newVal !== props.value) {
            props.onValueChange(newVal);
        }
    };

    return (
        <fieldset
            ref={ props.forwardedRef }
            className={ cx(css.root, directionMode[direction], props.cx) }
            onFocus={ props.onFocus }
            onBlur={ props.onBlur }
            { ...props.rawProps }
        >
            { props.items.map((i) => {
                const { id, name, renderName, ...restItemProps } = i;
                return (
                    <RadioInput
                        name={ props.name }
                        renderLabel={ i.renderName ? i.renderName : () => i.name }
                        value={ props.value === i.id }
                        onValueChange={ () => handleChange(i.id) }
                        isDisabled={ props.isDisabled || i.isDisabled }
                        isReadonly={ props.isReadonly }
                        isInvalid={ props.isInvalid }
                        isRequired={ props.isRequired }
                        key={ i.id.toString() }
                        size={ props.size || i.size }
                        { ...restItemProps }
                    />
                );
            }) }
        </fieldset>
    );
}
