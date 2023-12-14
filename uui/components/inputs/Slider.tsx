import { Slider as uuiSlider, SliderProps as uuiSliderProps } from '@epam/uui-components';
import css from './Slider.module.scss';
import { withMods } from '@epam/uui-core';

export interface SliderMods {}
export interface SliderProps extends uuiSliderProps, SliderMods {}

export function applySliderMods() {
    return [css.root, 'uui-color-neutral'];
}

export const Slider = withMods<SliderProps, SliderMods>(uuiSlider, applySliderMods);
