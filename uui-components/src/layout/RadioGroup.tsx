import * as React from 'react';
import {
    IHasCX, IEditable, IDisableable, IHasForwardedRef, IHasDirection, directionMode, ICanBeReadonly, cx, IHasRawProps, ICanFocus,
} from '@epam/uui-core';
import { RadioInputProps } from '../inputs/RadioInput';
import css from './RadioGroup.module.scss';

export interface RadioGroupItem<TValue> extends IDisableable {
    /** RadioInput label. Can be a string, or React.Element. */
    name?: string;
    /** Render callback for checkbox label.
     * If omitted, 'name' prop value will be rendered.
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
    /** Overrides the component to render a single radio Input  */
    RadioInput?: React.ComponentType<RadioInputProps>;
    /** Array of checkbox items to be rendered in group */
    items: RadioGroupItem<TValue>[];
    /** RadioInput prop to put on each radio input in group */
    radioInputProps?: RadioInputProps & { key: React.Key };
}

export class RadioGroup<TValue> extends React.Component<RadioGroupProps<TValue>> {
    handleChange = (newVal: TValue) => {
        if (newVal !== this.props.value) {
            this.props.onValueChange(newVal);
        }
    };

    render() {
        const { RadioInput, isDisabled, isInvalid } = this.props;
        const direction = this.props.direction || 'vertical';

        return (
            <fieldset
                ref={ this.props.forwardedRef }
                className={ cx(directionMode[direction], this.props.cx, css.container) }
                { ...this.props.rawProps }
                onFocus={ this.props.onFocus }
                onBlur={ this.props.onBlur }
            >
                {RadioInput
                    && this.props.items.map((i) => (
                        <RadioInput
                            renderLabel={ i.renderName ? i.renderName : () => i.name }
                            value={ this.props.value === i.id }
                            onValueChange={ () => this.handleChange(i.id) }
                            isDisabled={ isDisabled || i.isDisabled }
                            isReadonly={ this.props.isReadonly }
                            isInvalid={ isInvalid }
                            isRequired={ this.props.isRequired }
                            key={ i.id }
                            { ...this.props.radioInputProps }
                        />
                    ))}
            </fieldset>
        );
    }
}
