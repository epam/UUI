import * as React from 'react';
import { SliderScaleElement } from './SliderScaleElement';
import { uuiSlider } from './SliderBase';

interface SliderScaleProps<THandleOffsetValue> {
    min: number;
    max: number;
    slider: HTMLElement | null;
    valueWidth: number;
    splitAt: number;
    handleOffset: THandleOffsetValue;
    scaleUnitLabel?: string;
    renderLabel?: (value: number) => string;
}

export abstract class SliderScaleBase<THandleOffsetValue> extends React.Component<SliderScaleProps<THandleOffsetValue>> {

    abstract renderSliderScaleElements(): React.ReactElement<SliderScaleElement>[];

    generateScale = (step: number): number[] => {
        const min = this.props.min;
        const max = this.props.max;
        const count = (Math.ceil(max - min)) / step;
        let scale: number[] = [min];

        for (let i = 1; i < count; i += 1) {
            scale.push(scale[i - 1] + step);
        }

        scale.push(max);

        return scale;
    }

    render() {
        return (
            <div className={ uuiSlider.scale }>
                { this.renderSliderScaleElements() }
            </div>
        );
    }
}
