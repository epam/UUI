import * as React from 'react';
import { SliderScaleElement } from './SliderScaleElement';
import { SliderScaleBase } from './SliderScaleBase';
import { isClientSide } from '@epam/uui-core';

interface HandleOffsetValue {
    from: number;
    to: number;
}

export class RangeSliderScale extends SliderScaleBase<HandleOffsetValue> {
    renderSliderScaleElements() {
        const splitAt = this.props.splitAt || this.props.max;
        const sliderWidth = this.props.slider && this.props.slider.offsetWidth;
        return this.generateScale(splitAt).map((value) => {
            const offset = (value - this.props.min) * this.props.valueWidth;
            const sliderMargin = isClientSide && this.props.slider && +window.getComputedStyle(this.props.slider).marginLeft.slice(0, -2);
            return (
                <SliderScaleElement
                    key={ value }
                    sliderWidth={ sliderWidth }
                    offset={ offset }
                    isFilledDot={ this.props.handleOffset.from <= offset && offset <= this.props.handleOffset.to }
                    label={ value }
                    sliderMargin={ sliderMargin }
                />
            );
        });
    }
}
