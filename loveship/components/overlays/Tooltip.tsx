import * as types from '../types';
import css from './Tooltip.scss';
import styles from '../../assets/styles/scss/loveship-color-vars.scss';
import { withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps } from '@epam/uui-components';

export interface TooltipMods {
    color?: types.EpamColor;
}

function applyTooltipMods(mods: TooltipMods) {
    return [css.root, styles['color-' + (mods.color || 'night900')]];
}

export const Tooltip = withMods<TooltipProps, TooltipMods>(uuiTooltip, applyTooltipMods);
