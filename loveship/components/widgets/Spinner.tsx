import css from './Spinner.scss';
import styles from '../../assets/styles/scss/loveship-color-vars.scss';
import { withMods } from '@epam/uui-core';
import { Spinner as uuiSpinner, SpinnerProps } from '@epam/uui-components';
import * as types from '../types';

export interface SpinnerMods extends types.ColorMod {}

export function applySpinnerMods(mods: SpinnerMods) {
    return [css.root, styles['color-' + (mods.color || 'sky')]];
}

export const Spinner = withMods<SpinnerProps, SpinnerMods>(uuiSpinner, applySpinnerMods);
