import * as React from 'react';
import { cx, directionMode, ICanBeInvalid, ICanBeReadonly, IDisableable, IEditable, IHasCX, IHasDirection, IHasForwardedRef, IHasRawProps } from '@epam/uui-core';
import { Checkbox, CheckboxProps } from '../inputs';
import css from './CheckboxGroup.module.scss';

interface CheckboxGroupItem<TValue> extends Omit<CheckboxProps, 'id' | 'onValueChange' | 'value'> {
    /** Checkbox label. Can be a string, or React.ReactNode */
    name?: React.ReactNode;
    /** Item ID to put into selection */
    id: TValue;
    /** Render callback for checkbox label.
     * If omitted, 'name' prop value will be rendered.
     */
    renderName?: () => React.ReactNode;
}

export interface CheckboxGroupProps<TValue>
    extends ICanBeInvalid,
    IHasCX,
    IEditable<TValue[]>,
    IDisableable,
    IHasDirection,
    ICanBeReadonly,
    IHasRawProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>>,
    IHasForwardedRef<HTMLFieldSetElement> {
    /** Array of checkbox items to be rendered in group */
    items: CheckboxGroupItem<TValue>[];
    /** Defines group components size */
    size?: CheckboxProps['size'];
}

export function CheckboxGroup<TValue>(props: CheckboxGroupProps<TValue>) {
    const currentValue = props.value || [];
    const direction = props.direction || 'vertical';

    const handleChange = (selected: boolean, newVal: TValue) => {
        let newSelection;
        const actualValue = props.value || [];

        if (selected) {
            newSelection = actualValue.concat([newVal]);
        } else {
            newSelection = actualValue.filter((i) => i !== newVal);
        }

        props.onValueChange(newSelection);
    };

    return (
        <fieldset
            ref={ props.forwardedRef }
            className={ cx(css.root, directionMode[direction], props.cx) }
            { ...props.rawProps }
        >
            { props.items.map((i) => {
                const { id, name, renderName, ...restItemProps } = i;
                return (
                    <Checkbox
                        renderLabel={ i.renderName ? i.renderName : () => i.name }
                        value={ currentValue.indexOf(i.id) !== -1 }
                        onValueChange={ (selected) => handleChange(selected, i.id) }
                        isDisabled={ props.isDisabled }
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
