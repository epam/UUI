import { withMods } from '@epam/uui-core';
import { IconButton as uuiIconButton, UuiIconButtonProps } from '@epam/uui';
import * as types from '../../types';
import './IconButton.colorvars.scss';
import { EpamAdditionalColor, EpamGrayscaleColor, EpamPrimaryColor } from "../../types";

export type ThemeIconColor = EpamPrimaryColor | EpamAdditionalColor | EpamGrayscaleColor;

export interface IconButtonMods extends types.ColorMod {
    color?: ThemeIconColor;
}

export type IconButtonProps = UuiIconButtonProps & IconButtonMods;

const applyIconButtonMods = (mods: IconButtonMods) => [
    'uui-theme-loveship',
    `icon-button-color-${ mods.color }` || 'night600',
];

export const IconButton = withMods<Omit<UuiIconButtonProps, 'color'>, IconButtonMods>(
    uuiIconButton, applyIconButtonMods,
);
