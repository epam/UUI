import * as React from 'react';
import { SliderScaleBase, getSliderTrackMarginInlineStart } from './SliderScaleBase';
import { SliderScaleElement } from './SliderScaleElement';

export class SliderScale extends SliderScaleBase<number> {
    renderSliderScaleElements() {
        const splitAt = this.props.splitAt || this.props.max - this.props.min;
        const sliderWidth = this.props.slider?.offsetWidth;
        return this.generateScale(splitAt).map((value, index) => {
            const offset = (value - this.props.min) * this.props.valueWidth;
            const sliderMargin = getSliderTrackMarginInlineStart(this.props.slider);
            return (
                <SliderScaleElement
                    key={ index }
                    offset={ offset }
                    sliderWidth={ sliderWidth }
                    isFilledDot={ this.props.handleOffset > offset }
                    label={ this.props.renderLabel ? this.props.renderLabel(value) : value }
                    sliderMargin={ sliderMargin }
                />
            );
        });
    }
}
