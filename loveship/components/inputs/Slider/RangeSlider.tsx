import {
    RangeSlider as uuiRangeSlider, RangeSliderProps as uuiRangeSliderProps,
} from '@epam/uui-components';
import css from './RangeSlider.module.scss';
import { withMods } from '@epam/uui-core';
import * as types from '../../types';

export interface RangeSliderMods extends types.ColorMod {}

export interface RangeSliderProps extends uuiRangeSliderProps {}

export function applyRangeSliderMods() {
    return [
        css.root,
    ];
}

export const RangeSlider = withMods<uuiRangeSliderProps, RangeSliderMods>(uuiRangeSlider, applyRangeSliderMods);
