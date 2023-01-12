import React from 'react';
import { withMods } from '@epam/uui-core';
import { allEpamPrimaryColors, EpamPrimaryColor } from '../types';
import { IconButton as uuiIconButton, IconButtonProps as UuiIconButtonProps } from '@epam/uui';


export type IconColor = EpamPrimaryColor | 'gray30' | 'gray50' | 'gray60';
export const allIconColors: IconColor[] = [...allEpamPrimaryColors, 'gray30', 'gray50', 'gray60'];

export interface IconButtonMods {
    color?: IconColor;
}

function applyIconButtonMods(mods: Omit<UuiIconButtonProps, 'color'> & IconButtonMods) {
    return [
        'uui-theme-promo',
        [`icon-button-color-${ mods.color || "gray60" }`],
    ];
}

export type IconButtonProps = Omit<UuiIconButtonProps, 'color'> & IconButtonMods;

export const IconButton = withMods<Omit<UuiIconButtonProps, 'color'>, IconButtonMods>(uuiIconButton, applyIconButtonMods);
