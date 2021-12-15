import * as React from 'react';
import { IEditable, IHasRawProps, cx } from '@epam/uui';
import { ButtonProps } from '@epam/uui-components';
import { Button, ControlGroup } from '../index';
import * as types from '../types';
import * as css from './MultiSwitch.scss';

interface MultiSwitchItem<TValue> extends ButtonProps, types.ColorMod {
    id: TValue;
}

export interface MultiSwitchProps<TValue> extends IEditable<TValue>, types.ColorMod, types.SizeMod, IHasRawProps<HTMLDivElement> {
    items: MultiSwitchItem<TValue>[];
}

export class MultiSwitch<TValue> extends React.Component<MultiSwitchProps<TValue>> {
    render() {
        return (
            <ControlGroup rawProps={ { ...this.props.rawProps, role: 'tablist' } }>
                {
                    this.props.items.map((item, index) => {
                        const isActive = this.props.value === item.id;

                        return (
                            <Button
                                {  ...item }
                                cx={ cx(item.cx, { [css.selectedItem]: isActive }) }
                                key={ index + '-' + item.id }
                                onClick={ () => this.props.onValueChange(item.id) }
                                shape="square"
                                fill={ isActive ? 'solid' : 'white' }
                                color={ item.color || this.props.color }
                                size={ this.props.size }
                                rawProps={{ 'aria-current': this.props.value === item.id, role: 'tab' }}
                            />
                        );
                    })
                }
            </ControlGroup>
        );
    }
}
