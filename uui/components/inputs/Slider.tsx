import { Slider as uuiSlider, SliderBaseProps } from '@epam/uui-components';
import css from './Slider.module.scss';
import { withMods } from '@epam/uui-core';

interface SliderMods {}
export interface SliderProps extends SliderBaseProps<number>, SliderMods {}

function applySliderMods() {
    return [css.root, 'uui-color-neutral'];
}

export const Slider = withMods<SliderBaseProps<number>, SliderMods>(uuiSlider, applySliderMods);
