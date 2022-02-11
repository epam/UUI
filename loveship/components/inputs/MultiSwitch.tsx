import * as React from 'react';
import { IEditable, IHasRawProps } from '@epam/uui';
import { ButtonProps } from '@epam/uui-components';
import cx from 'classnames';
import { Button, ControlGroup } from '../index';
import * as types from '../types';
import * as css from './MultiSwitch.scss';

interface MultiSwitchItem<TValue> extends ButtonProps, types.ColorMod {
    id: TValue;
}

export interface MultiSwitchProps<TValue> extends IEditable<TValue>, types.ColorMod, types.SizeMod, IHasRawProps<HTMLDivElement> {
    items: MultiSwitchItem<TValue>[];
}

function MultiSwitchComponent<TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <ControlGroup ref={ ref } rawProps={ { ...props.rawProps, role: 'tablist' } }>
            { props.items.map((item, index) => {
                const isActive = props.value === item.id;
                return (
                    <Button
                        {  ...item }
                        cx={ cx(item.cx, { [css.selectedItem]: isActive }) }
                        key={ index + '-' + item.id }
                        onClick={ () => props.onValueChange(item.id) }
                        shape="square"
                        fill={ isActive ? 'solid' : 'white' }
                        color={ item.color || props.color }
                        size={ props.size }
                        rawProps={ { 'aria-current': props.value === item.id, role: 'tab' } }
                    />
                );
            }) }
        </ControlGroup>
    );
};

export const MultiSwitch = React.forwardRef(MultiSwitchComponent) as <TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) => JSX.Element;