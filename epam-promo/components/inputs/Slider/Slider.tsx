import * as React from 'react';
import { Slider as UuiSlider, SliderBaseProps } from '@epam/uui-components';
import css from './Slider.scss';
import { withMods } from '@epam/uui-core';

export interface SliderMods {}

export function applySliderMods(mods: SliderBaseProps<number>) {
    return [css.root];
}

export const Slider = withMods<SliderBaseProps<number>, SliderMods>(UuiSlider, applySliderMods);
