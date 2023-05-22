import { RangeSlider as uuiRangeSlider, SliderBaseProps, RangeSliderValue } from '@epam/uui-components';
import css from './Slider.module.scss';
import { withMods } from '@epam/uui-core';
import * as types from '../../types';

export interface RangeSliderMods extends types.ColorMod {}

export function applyRangeSliderMods() {
    return [
        css.root,
    ];
}

export const RangeSlider = withMods<SliderBaseProps<RangeSliderValue>, RangeSliderMods>(uuiRangeSlider, applyRangeSliderMods);
