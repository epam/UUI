import * as React from 'react';
import cx from 'classnames';
import * as css from './RadioGroup.scss';
import { RadioInputProps } from '../inputs/RadioInput';
import { IHasCX, IEditable, IDisableable, IHasDirection, directionMode, ICanBeReadonly } from '@epam/uui';

export interface RadioGroupItem<TValue> extends IDisableable {
    name?: string;
    renderName?: () => any;
    id: TValue;
}

export interface RadioGroupProps<TValue> extends IHasCX, IEditable<TValue>, IDisableable, IHasDirection, ICanBeReadonly {
    RadioInput?: React.ComponentClass<RadioInputProps>;
    items: RadioGroupItem<TValue>[];
    radioInputProps?: any;
}

export class RadioGroup<TValue> extends React.Component<RadioGroupProps<TValue>> {

    handleChange = (newVal: TValue) => {
        if (newVal !== this.props.value) {
            this.props.onValueChange(newVal);
        }
    }

    render() {
        const { RadioInput, isDisabled, isInvalid } = this.props;
        const direction = this.props.direction || 'vertical';

        return (
            <div className={ cx(directionMode[direction], this.props.cx, css.container) }>
                {
                    RadioInput && this.props.items.map(i =>
                        <RadioInput
                            renderLabel={ i.renderName ? i.renderName : () => i.name }
                            value={ this.props.value === i.id }
                            onValueChange={ () => this.handleChange(i.id) }
                            isDisabled={ isDisabled || i.isDisabled }
                            isReadonly={ this.props.isReadonly }
                            isInvalid={ isInvalid }
                            { ...this.props.radioInputProps }
                            key={ i.id }
                        />,
                    )
                }
            </div>
        );
    }
}