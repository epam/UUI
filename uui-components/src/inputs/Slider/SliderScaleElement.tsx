import * as React from 'react';
import { cx, getDir } from '@epam/uui-core';
import { uuiSlider } from './SliderBase';

interface SliderScaleElementProps {
    sliderWidth: number | undefined;
    label: number | string;
    offset: number;
    isFilledDot: boolean;
    sliderMargin: number;
    renderLabel?: (value: number) => string;
}

interface SliderScaleElementState {
    scaleNumberWidth: number;
    scaleDotWidth: number;
}

export class SliderScaleElement extends React.Component<SliderScaleElementProps, SliderScaleElementState> {
    scaleNumber: HTMLElement | null;
    scaleDot: HTMLElement | null;
    componentDidMount() {
        if (this.scaleNumber && this.scaleDot) {
            this.setState({ scaleDotWidth: this.scaleDot.offsetWidth, scaleNumberWidth: this.scaleNumber.offsetWidth });
        }
    }

    calculateLabelPosition = () => {
        const { offset, sliderWidth, sliderMargin } = this.props;
        const scaleNumberWidth = this.scaleNumber ? this.state.scaleNumberWidth ?? 0 : 0;

        if (offset === 0) {
            return 0;
        }
        if (Math.abs(sliderWidth - offset) < 1) {
            return offset - Math.ceil(scaleNumberWidth) + 2 * sliderMargin;
        }
        return offset + sliderMargin - Math.ceil(scaleNumberWidth / 2);
    };

    render() {
        const { offset, sliderMargin } = this.props;
        const isRtl = getDir() === 'rtl';
        const sign = isRtl ? -1 : 1;

        const dotOffset = offset + sliderMargin - (this.scaleDot ? (this.state.scaleDotWidth ?? 0) / 2 : 0);
        const numberOffset = this.calculateLabelPosition();

        return (
            <>
                <div
                    className={ cx(uuiSlider.scaleDot, this.props.isFilledDot && uuiSlider.scaleFilledDot) }
                    ref={ (scaleDotRef) => {
                        (this.scaleDot = scaleDotRef);
                    } }
                    style={ { transform: `translateX(${sign * dotOffset}px)` } }
                />
                <div
                    className={ uuiSlider.scaleNumber }
                    ref={ (scaleNumberRef) => {
                        (this.scaleNumber = scaleNumberRef);
                    } }
                    style={ { transform: `translateX(${sign * numberOffset}px)` } }
                >
                    {this.props.label}
                </div>
            </>
        );
    }
}
