import * as React from 'react';
import {
    IHasCX, IEditable, IDisableable, IHasForwardedRef, IHasDirection, directionMode, ICanBeReadonly, cx, IHasRawProps,
} from '@epam/uui-core';
import { RadioInputProps } from '../inputs/RadioInput';
import css from './RadioGroup.module.scss';

export interface RadioGroupItem<TValue> extends IDisableable {
    name?: string;
    renderName?: () => React.ReactNode;
    id: TValue;
}

export interface RadioGroupProps<TValue>
    extends IHasCX,
    IEditable<TValue>,
    IDisableable,
    IHasDirection,
    ICanBeReadonly,
    IHasRawProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>>,
    IHasForwardedRef<HTMLFieldSetElement> {
    RadioInput?: React.ComponentType<RadioInputProps>;
    items: RadioGroupItem<TValue>[];
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
            <fieldset ref={ this.props.forwardedRef } className={ cx(directionMode[direction], this.props.cx, css.container) } { ...this.props.rawProps }>
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
