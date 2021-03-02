import * as React from 'react';
import { SliderScaleElement } from './SliderScaleElement';
import { SliderScaleBase } from './SliderScaleBase';

interface HandlerOffsetValue {
    from: number;
    to: number;
}

export class SliderScale extends SliderScaleBase<number> {
    renderSliderScaleElements() {
        const splitAt = this.props.splitAt || (this.props.max - this.props.min);
        const sliderWidth = this.props.slider?.offsetWidth;
        return this.generateScale(splitAt).map((value, index) => {
            const offset = (value - this.props.min) * this.props.valueWidth;
            return (
                <SliderScaleElement
                    key={ index }
                    offset={ offset }
                    sliderWidth={ sliderWidth }
                    isFilledDot={ this.props.handleOffset > offset }
                    label={ this.props.renderLabel ? this.props.renderLabel(value) : value }
                    sliderMargin={ this.props.slider && +window.getComputedStyle(this.props.slider).marginLeft.slice(0, -2) }
                />
            );
        });
    }
}
