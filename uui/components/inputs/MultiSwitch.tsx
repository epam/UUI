import * as React from 'react';
import { IEditable, IHasRawProps } from '@epam/uui-core';
import { ButtonProps } from '@epam/uui-components';
import { ControlGroup } from '../layout/ControlGroup';
import { Button, ButtonMods } from '../buttons';
import { SizeMod } from '../types';

interface MultiSwitchItem<TValue> extends ButtonProps, ButtonMods {
    id: TValue;
}

export type UuiMultiSwitchColor = 'primary' | 'secondary';

export interface MultiSwitchProps<TValue> extends IEditable<TValue>, SizeMod, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    items: MultiSwitchItem<TValue>[];
    color?: UuiMultiSwitchColor;
}

function MultiSwitchComponent<TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <ControlGroup ref={ ref } rawProps={ { ...props.rawProps, role: 'tablist' } }>
            {props.items.map((item, index) => (
                <Button
                    { ...props }
                    { ...item }
                    isDisabled={ props.isDisabled }
                    key={ index + '-' + item.id }
                    onClick={ () => props.onValueChange(item.id) }
                    fill={ props.value === item.id ? 'solid' : 'outline' }
                    color={ props.color }
                    size={ props.size }
                    rawProps={ { 'aria-current': props.value === item.id, role: 'tab' } }
                />
            ))}
        </ControlGroup>
    );
}

export const MultiSwitch = React.forwardRef(MultiSwitchComponent);
