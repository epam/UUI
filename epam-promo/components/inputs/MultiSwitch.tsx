import * as React from 'react';
import { IEditable, IHasRawProps } from '@epam/uui-core';
import { ButtonProps } from '@epam/uui-components';
import { ControlGroup } from '../layout';
import { Button, ButtonColor, ButtonMods } from '../buttons';
import { SizeMod } from '../types';

interface MultiSwitchItem<TValue> extends ButtonProps {
    id: TValue;
}

export interface MultiSwitchProps<TValue> extends IEditable<TValue>, SizeMod, IHasRawProps<HTMLDivElement> {
    items: MultiSwitchItem<TValue>[];
    color?: "blue" | 'gray50';
}


function MultiSwitchComponent<TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <ControlGroup ref={ ref } rawProps={ { ...props.rawProps, role: 'tablist' } }>
            { props.items.map((item, index) => (
                <Button
                    {  ...item }
                    isDisabled={ props.isDisabled }
                    key={ index + '-' + item.id }
                    onClick={ () => props.onValueChange(item.id) }
                    fill={ props.value === item.id ? 'solid' : 'white' }
                    color={ props.color === 'gray50' && props.value === item.id ? 'blue' : props.color || 'blue' }
                    size={ props.size }
                    rawProps={ { 'aria-current': props.value === item.id, role: 'tab' } }
                />
            )) }
        </ControlGroup>
    );
};

export const MultiSwitch = React.forwardRef(MultiSwitchComponent) as <TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) => JSX.Element;