import * as React from 'react';
import { IEditable, IHasRawProps } from '@epam/uui-core';
import { ControlGroup } from '../layout/ControlGroup';
import { Button, ButtonProps } from '../buttons';
import { ControlSize } from '../types';

type MultiSwitchItem<TValue> = ButtonProps & {
    /**
     * Defines the id of MultiSwitchItem.
     */
    id: TValue;
};

type MultiSwitchMods = {
    /**
     * Defines component color.
     * @default 'primary'
     */
    color?: 'primary' | 'secondary';
};

/** Represents the 'Core properties' for the MultiSwitch component. */
export type MultiSwitchCoreProps<TValue> = IEditable<TValue> & IHasRawProps<React.HTMLAttributes<HTMLDivElement>> & {
    /**
     * Defines an array of MultiSwitchItems.
     */
    items: MultiSwitchItem<TValue>[];
    /**
     * Defines component size.
     */
    size?: ControlSize | '60';
};

/** Represents the properties for the MultiSwitch component. */
export type MultiSwitchProps<TValue = unknown> = MultiSwitchCoreProps<TValue> & MultiSwitchMods;

function MultiSwitchComponent<TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <ControlGroup
            ref={ ref }
            rawProps={ {
                ...props.rawProps,
                role: 'tablist',
                'aria-invalid': props.isInvalid,
                'aria-required': props.isRequired,
                'aria-disabled': props.isDisabled,
                'aria-readonly': props.isReadonly,
            } }
        >
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
