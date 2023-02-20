import * as React from 'react';
import { SliderScaleElement } from './SliderScaleElement';
import { SliderScaleBase } from './SliderScaleBase';
import { isClientSide } from '@epam/uui-core';

interface HandlerOffsetValue {
    from: number;
    to: number;
}

export class SliderScale extends SliderScaleBase<number> {
    renderSliderScaleElements() {
        const splitAt = this.props.splitAt || this.props.max - this.props.min;
        const sliderWidth = this.props.slider?.offsetWidth;
        return this.generateScale(splitAt).map((value, index) => {
            const offset = (value - this.props.min) * this.props.valueWidth;
            const sliderMargin = isClientSide && this.props.slider && +window.getComputedStyle(this.props.slider).marginLeft.slice(0, -2);
            return (
                <SliderScaleElement
                    key={index}
                    offset={offset}
                    sliderWidth={sliderWidth}
                    isFilledDot={this.props.handleOffset > offset}
                    label={this.props.renderLabel ? this.props.renderLabel(value) : value}
                    sliderMargin={sliderMargin}
                />
            );
        });
    }
}
