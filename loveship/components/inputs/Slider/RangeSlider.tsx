import { RangeSlider as uuiRangeSlider, SliderBaseProps, RangeSliderValue } from '@epam/uui-components';
import css from './RangeSlider.module.scss';
import { createSkinComponent } from '@epam/uui-core';
import { EpamColor } from '../../types';

interface RangeSliderMods {
    /**
     * Defines component color.
     */
    color?: EpamColor;
}

/** Represents the properties of a RangeSlider component. */
export type RangeSliderProps = SliderBaseProps<RangeSliderValue> & RangeSliderMods;

export function applyRangeSliderMods() {
    return [
        css.root,
    ];
}

export const RangeSlider = createSkinComponent<SliderBaseProps<RangeSliderValue>, RangeSliderProps>(
    uuiRangeSlider,
    () => null,
    applyRangeSliderMods,
);
