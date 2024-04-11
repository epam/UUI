import {
    RangeSlider as uuiRangeSlider, RangeSliderProps as uuiRangeSliderProps,
} from '@epam/uui-components';
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
export interface RangeSliderProps extends uuiRangeSliderProps, RangeSliderMods {}

export function applyRangeSliderMods() {
    return [
        css.root,
    ];
}

export const RangeSlider = /* @__PURE__ */createSkinComponent<uuiRangeSliderProps, RangeSliderProps>(
    uuiRangeSlider,
    () => null,
    applyRangeSliderMods,
);
