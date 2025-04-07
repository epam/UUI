import * as React from 'react';
import { IEditable, IHasRawProps, Overwrite } from '@epam/uui-core';
import { ControlGroup } from '../layout/ControlGroup';
import { Button, ButtonProps } from '../buttons';
import { ControlSize } from '../types';

type MultiSwitchItem = ButtonProps & {
    /**
     * Defines the id of MultiSwitchItem.
     */
    id: any;
};

interface MultiSwitchMods {
    /**
     * Defines component color.
     * @default 'primary'
     */
    color?: 'primary' | 'secondary';
    /**
     * Defines component size.
     * @default '36'
     */
    size?: ControlSize | '60';
}

export interface MultiSwitchModsOverride {}

/** Represents the 'Core properties' for the MultiSwitch component. */
export type MultiSwitchCoreProps<TValue> = IEditable<TValue> & IHasRawProps<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement> & {
    /**
     * Defines an array of MultiSwitchItems.
     */
    items: MultiSwitchItem[];
};

/** Represents the properties for the MultiSwitch component. */
export type MultiSwitchProps<TValue = unknown> = MultiSwitchCoreProps<TValue> & Overwrite<MultiSwitchMods, MultiSwitchModsOverride>;

function MultiSwitchComponent<TValue>(props: MultiSwitchProps<TValue>) {
    const { ref, ...restProps } = props;
    return (
        <ControlGroup
            ref={ props.ref }
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
                    { ...restProps }
                    { ...item }
                    isDisabled={ props.isDisabled }
                    key={ index + '-' + item.id }
                    onClick={ !props.isReadonly && (() => props.onValueChange(item.id)) }
                    fill={ props.value === item.id ? 'solid' : 'outline' }
                    color={ props.color }
                    size={ props.size }
                    rawProps={ { 'aria-current': props.value === item.id, role: 'tab' } }
                />
            ))}
        </ControlGroup>
    );
}

export const MultiSwitch = MultiSwitchComponent;
