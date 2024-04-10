import * as React from 'react';
import {
    IHasCX, IEditable, IDisableable, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';

export interface SliderBaseProps<TSelection>
    extends IHasCX,
    IEditable<TSelection>,
    IDisableable,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    IHasForwardedRef<HTMLDivElement> {
    /** Min value (when slider is at leftmost position) */
    min: number;
    /** Max value (when slider is at rightmost position) */
    max: number;
    /** Value change step */
    step: number;

    /** Slider renders a label at each splitAt position */
    splitAt?: number;

    /** Overrides rendering of values labels */
    renderLabel?: (value: number) => string;

    /** Toggles rendering of tooltip with current value */
    showTooltip?: boolean;
}

export interface SliderBaseState {
    isActive: boolean;
    valueWidth: number;
}

export const uuiSlider = {
    container: 'uui-slider-container',
    slider: 'uui-slider',
    filled: 'uui-slider-filled',
    handle: 'uui-slider-handle',
    scale: 'uui-slider-scale',
    scaleNumber: 'uui-slider-scale-number',
    scaleDot: 'uui-slider-scale-dot',
    scaleFilledDot: 'uui-slider-scale-filled-dot',
} as const;

export abstract class SliderBase<TSelection, TState extends SliderBaseState> extends React.Component<SliderBaseProps<TSelection>, TState> {
    slider: HTMLElement | null;
    componentDidMount() {
        this.setState({ valueWidth: this.slider && this.slider.offsetWidth / (this.props.max - this.props.min) });
        document.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('resize', this.handleResize);
    }

    getFloatPrecision = (step: number): number => {
        const stepString = step.toString();
        const decimalIndex = stepString.indexOf('.');
        return decimalIndex >= 0 ? stepString.length - decimalIndex - 1 : 0;
    };

    roundToStep(value: number, step: number) {
        const precision = this.getFloatPrecision(step);
        let rounded = this.props.min + Math.round(Math.abs((value - this.props.min) / step)) * step;
        rounded = parseFloat(rounded.toFixed(precision));

        if (rounded < this.props.min) {
            return this.props.min;
        } else if (rounded > this.props.max) {
            return this.props.max;
        } else {
            return rounded;
        }
    }

    handleResize = () => {
        if (this.state.valueWidth * (this.props.max - this.props.min) !== this.slider?.offsetWidth) {
            this.forceUpdate();
        }
    };

    handleMouseDown = () => {
        this.setState({ isActive: true });
    };

    handleMouseUp = () => {
        this.state.isActive && this.setState({ isActive: false });
    };

    getValue = (mouseX: number, valueWidth?: number) => {
        if (mouseX < this.slider.getBoundingClientRect().left) {
            return this.props.min;
        } else if (mouseX > this.slider.getBoundingClientRect().right) {
            return this.props.max;
        } else {
            return this.roundToStep((mouseX - this.slider.getBoundingClientRect().left) / valueWidth + this.props.min, this.props.step);
        }
    };
}
