import React, { ComponentType, ForwardedRef, FunctionComponent, NamedExoticComponent } from 'react';
import { withMods } from "@epam/uui-core";
import { ButtonMode, MultiSwitch as UuiMultiSwitch, MultiSwitchColor, MultiSwitchProps, MultiSwitchProps as UuiMultiSwitchProps } from "@epam/uui";
import { FillStyle } from "../types";

type ThemeColors = 'blue' | 'gray50';

export interface MultiSwitchMods {
    mode?: MultiSwitchFillStyle;
    color?: ThemeColors;
}

type MultiSwitchFillStyle = Exclude<FillStyle, "light" | "none">;
type MultiSwitchFillMods = Exclude<ButtonMode, "ghost" | "none">;

const mapFillToMod: Record<MultiSwitchFillStyle, MultiSwitchFillMods> = {
    solid: 'solid',
    white: 'outline',
};

const mapColorToMod: Record<ThemeColors, MultiSwitchColor> = {
    blue: 'primary',
    gray50: 'secondary',
};

export const applyMultiSwitchMods = () => ['uui-theme-promo'];

export const MultiSwitch = withMods(
    UuiMultiSwitch,
    applyMultiSwitchMods,
    (props) => ({
        mode: props.mode || mapFillToMod.solid,
        color: props.color || mapColorToMod.blue,
    }),
) as <TValue>(props: MultiSwitchProps<TValue> & MultiSwitchMods) => JSX.Element;



// import * as React from 'react';
// import { IEditable, IHasRawProps } from '@epam/uui-core';
// import { ButtonProps } from '@epam/uui-components';
// import { ControlGroup } from '../layout';
// import { Button, ButtonMods } from '../buttons';
// import { SizeMod } from '../types';
//
// interface MultiSwitchItem<TValue> extends ButtonProps, ButtonMods {
//     id: TValue;
// }
//
// export interface MultiSwitchProps<TValue> extends IEditable<TValue>, SizeMod, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
//     items: MultiSwitchItem<TValue>[];
//     color?: 'blue' | 'gray50';
// }
//
// function MultiSwitchComponent<TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) {
//     return (
//         <ControlGroup ref={ ref } rawProps={ { ...props.rawProps, role: 'tablist' } }>
//             { props.items.map((item, index) => (
//                 <Button
//                     {  ...item }
//                     isDisabled={ props.isDisabled }
//                     key={ index + '-' + item.id }
//                     onClick={ () => props.onValueChange(item.id) }
//                     fill={ props.value === item.id ? 'solid' : 'white' }
//                     color={ props.color === 'gray50' && props.value === item.id ? 'blue' : props.color || 'blue' }
//                     size={ props.size }
//                     rawProps={ { 'aria-current': props.value === item.id, role: 'tab' } }
//                 />
//             )) }
//         </ControlGroup>
//     );
// }
//
// export const MultiSwitch = React.forwardRef(MultiSwitchComponent) as <TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) => JSX.Element;