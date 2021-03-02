import * as React from 'react';
import cx from 'classnames';
import * as css from './CheckboxGroup.scss';
import { CheckboxProps } from '../inputs/Checkbox';
import { ICanBeInvalid, IHasCX, IEditable, IDisableable, IHasDirection, directionMode, ICanBeReadonly } from '@epam/uui';

interface CheckboxGroupItem<TValue> {
    name: string;
    id: TValue;
    renderName?: () => any;
}

export interface CheckboxGroupProps<TValue> extends ICanBeInvalid, IHasCX, IEditable<TValue[]>, IDisableable, IHasDirection, ICanBeReadonly {
    CheckboxInput?: React.ComponentClass<CheckboxProps>;
    items: CheckboxGroupItem<TValue>[];
}

export class CheckboxGroup<TValue> extends React.Component<CheckboxGroupProps<TValue>> {

    handleChange = (selected: boolean, newVal: TValue) => {
        let newSelection;
        const currentValue = this.props.value || [];

        if (selected) {
            newSelection = currentValue.concat([newVal]);
        } else {
            newSelection = currentValue.filter(i => i !== newVal);
        }

        this.props.onValueChange(newSelection);
    }

    render() {
        const { CheckboxInput, isDisabled, isInvalid } = this.props;
        const currentValue = this.props.value || [];
        const direction = this.props.direction || 'vertical';

        return (
            <div className={ cx(directionMode[direction], this.props.cx, css.container) }>
                {
                    this.props.items.map(i =>
                        <CheckboxInput
                            renderLabel={ i.renderName ? i.renderName : () => i.name }
                            value={ currentValue.indexOf(i.id) !== -1 }
                            onValueChange={ (selected) => this.handleChange(selected, i.id) }
                            isDisabled={ isDisabled }
                            isReadonly={ this.props.isReadonly }
                            isInvalid={ isInvalid }
                            key={ i.id.toString() }
                        />,
                    )
                }
            </div>
        );
    }
}