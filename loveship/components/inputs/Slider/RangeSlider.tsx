import {
    RangeSlider as uuiRangeSlider, RangeSliderProps as uuiRangeSliderProps,
} from '@epam/uui-components';
import css from './RangeSlider.module.scss';
import { createSkinComponent } from '@epam/uui-core';

/** Represents the properties of a RangeSlider component. */
export interface RangeSliderProps extends uuiRangeSliderProps {}

export function applyRangeSliderMods() {
    return [
        css.root,
    ];
}

export const RangeSlider = createSkinComponent<uuiRangeSliderProps, RangeSliderProps>(
    uuiRangeSlider,
    () => null,
    applyRangeSliderMods,
);
