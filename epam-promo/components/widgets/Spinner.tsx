import * as React from 'react';
import { Spinner as uuiSpinner, SpinnerProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as css from './Spinner.scss';
import * as styles from '../../assets/styles/colorvars/widgets/spinner-colorvars.scss';

export type SpinnerColor = 'blue' | 'gray50' | 'white';
export const allSpinnerColors: SpinnerColor[] = ['blue', 'white', 'gray50'];

export interface SpinnerMods {
    color?: SpinnerColor;
}

export function applySpinnerMods(mods: SpinnerMods) {
    return [
        styles['spinner-color-' + (mods.color || 'blue')],
        css.root,
    ];
}

export const Spinner = withMods<SpinnerProps, SpinnerMods>(uuiSpinner, applySpinnerMods);