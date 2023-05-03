import { Slider as UuiSlider, SliderBaseProps } from '@epam/uui-components';
import css from './Slider.scss';
import { withMods } from '@epam/uui-core';

export function applySliderMods() {
    return [css.root];
}

export const Slider = withMods<SliderBaseProps<number>>(UuiSlider, applySliderMods);
