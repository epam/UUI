import * as React from 'react';
import { SliderScaleElement } from './SliderScaleElement';
import { SliderScaleBase, getSliderTrackMarginInlineStart } from './SliderScaleBase';

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
            const sliderMargin = getSliderTrackMarginInlineStart(this.props.slider);
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
