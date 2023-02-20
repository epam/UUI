import { Slider as UuiSlider, SliderBaseProps } from '@epam/uui-components';
import css from './Slider.scss';
import styles from '../../../assets/styles/scss/loveship-color-vars.scss';
import * as types from '../../types';
import { withMods } from '@epam/uui-core';

export interface SliderMods extends types.ColorMod {}

export function applySliderMods(mods: SliderMods & SliderBaseProps<number>) {
    return [css.root, !mods.isDisabled && styles['color-' + (mods.color || 'sky')]];
}

export const Slider = withMods<SliderBaseProps<number>, SliderMods>(UuiSlider, applySliderMods);
