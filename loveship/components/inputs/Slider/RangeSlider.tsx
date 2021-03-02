import { RangeSlider as uuiRangeSlider, SliderBaseProps, RangeSliderValue } from '@epam/uui-components';
import * as css from './Slider.scss';
import * as styles from '../../../assets/styles/scss/loveship-color-vars.scss';
import { withMods } from '@epam/uui';
import * as types from '../../types';

export interface RangeSliderMods extends types.ColorMod { }

export function applyRangeSliderMods(mods: RangeSliderMods) {
    return [
        css.root,
        styles['color-' + (mods.color || 'sky')],
    ];
}

export const RangeSlider = withMods<SliderBaseProps<RangeSliderValue>, any>(uuiRangeSlider, applyRangeSliderMods);