import React from 'react';
import { IEditable } from '@epam/uui';
import { ButtonProps } from '@epam/uui-components';
import cx from 'classnames';
import { Button, ControlGroup } from '../index';
import * as types from '../types';
import * as css from './MultiSwitch.scss';

interface MultiSwitchItem<TValue> extends ButtonProps, types.ColorMod {
    id: TValue;
}

export interface MultiSwitchProps<TValue> extends IEditable<TValue>, types.ColorMod, types.SizeMod {
    items: MultiSwitchItem<TValue>[];
}

export class MultiSwitch<TValue> extends React.Component<MultiSwitchProps<TValue>, any> {

    render() {
        return (
            <ControlGroup>
                {
                    this.props.items.map((item, index) => {
                        const isActive = this.props.value === item.id;

                        return (
                            <Button
                                {  ...item }
                                cx={ cx(item.cx, { [css.selectedItem]: isActive }) }
                                key={ index + '-' + item.id as any }
                                onClick={ () => this.props.onValueChange(item.id) }
                                shape="square"
                                fill={ isActive ? 'solid' : 'white' }
                                color={ item.color || this.props.color }
                                size={ this.props.size }
                            />
                        );
                    })
                }
            </ControlGroup>
        );
    }
}
