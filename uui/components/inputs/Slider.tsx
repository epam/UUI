import { Slider as uuiSlider, SliderProps as uuiSliderProps } from '@epam/uui-components';
import css from './Slider.module.scss';
import { withMods } from '@epam/uui-core';

export interface SliderProps extends uuiSliderProps {}

function applySliderMods() {
    return [css.root, 'uui-color-neutral'];
}

export const Slider = withMods<SliderProps, SliderProps>(uuiSlider, applySliderMods);
