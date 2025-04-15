import * as React from 'react';
import { cx } from '@epam/uui-core';
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
        if (this.props.offset === 0) {
            return 0;
        }
        if (this.props.sliderWidth === parseInt(`${this.props.offset}`, 10)) {
            return this.props.offset - Math.ceil(this.scaleNumber ? this.state.scaleNumberWidth : 0) + 2 * this.props.sliderMargin;
        }
        return this.props.offset + this.props.sliderMargin - Math.ceil(this.scaleNumber ? this.state.scaleNumberWidth / 2 : 0);
    };

    render() {
        const dotOffset = this.props.offset + this.props.sliderMargin - (this.scaleDot ? this.state.scaleDotWidth / 2 : 0);
        const numberOffset = this.calculateLabelPosition();

        return (
            <>
                <div
                    className={ cx(uuiSlider.scaleDot, this.props.isFilledDot && uuiSlider.scaleFilledDot) }
                    ref={ (scaleDotRef) => {
                        (this.scaleDot = scaleDotRef);
                    } }
                    style={ { transform: `translateX(${dotOffset}px)` } }
                />
                <div
                    className={ uuiSlider.scaleNumber }
                    ref={ (scaleNumberRef) => {
                        (this.scaleNumber = scaleNumberRef);
                    } }
                    style={ { transform: `translateX(${numberOffset}px)` } }
                >
                    {this.props.label}
                </div>
            </>
        );
    }
}
