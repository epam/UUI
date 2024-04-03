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
    getPrecision = (step: number): number => {
        const stepString = step.toString();
        const decimalIndex = stepString.indexOf('.');
        return decimalIndex >= 0 ? stepString.length - decimalIndex - 1 : 0;
    };

    generateScale = (step: number): number[] => {
        const min = this.props.min;
        const max = this.props.max;
        const precision = this.getPrecision(step);
        const count = (max - min) / step;
        const scale: number[] = [min];

        for (let i = 1; i < count; i += 1) {
            const newValue = parseFloat((min + i * step).toFixed(precision));
            scale.push(newValue);
        }

        scale.push(max);

        return scale;
    };

    render() {
        return <div className={ uuiSlider.scale }>{this.renderSliderScaleElements()}</div>;
    }
}
