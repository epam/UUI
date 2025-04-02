import * as React from 'react';
import { uuiMod, cx } from '@epam/uui-core';
import { SliderBase, SliderBaseProps, uuiSlider } from './SliderBase';
import { SliderHandle } from './SliderHandle';
import { SliderScale } from './SliderScale';
import css from './SliderBase.module.scss';

export interface SliderProps extends SliderBaseProps<number> {}
export class Slider extends SliderBase<number, any> {
    state = {
        isActive: false,
    };

    normalize(value: number) {
        if (!value && value !== 0) {
            return this.props.min;
        }

        return value > this.props.max ? this.props.max : value < this.props.min ? this.props.min : value;
    }

    handleKeyDownUpdate(type: 'left' | 'right') {
        const { value, step, min, max } = this.props;
        const floatPrecision = this.getFloatPrecision(step);

        if (type === 'left') {
            const newValue = ((value * floatPrecision - step * floatPrecision) / floatPrecision);
            if (newValue < min) return;
            else this.props.onValueChange(newValue);
        } else if (type === 'right') {
            const newValue = ((value * floatPrecision + step * floatPrecision) / floatPrecision);
            if (newValue > max) return;
            this.props.onValueChange(newValue);
        }
    }

    render() {
        const normValue = this.roundToStep(this.normalize(this.props.value), this.props.step);
        const valueWidth = (this.slider && this.slider.offsetWidth / (this.props.max - this.props.min)) || 0;
        const filledOffset = (normValue - this.props.min) * valueWidth;

        return (
            <div
                className={ cx(uuiSlider.container, css.root, this.props.isDisabled && uuiMod.disabled, this.props.cx, this.state.isActive && uuiMod.active) }
                onClick={ (e) => this.props.onValueChange(this.getValue(e.clientX, valueWidth)) }
                onMouseDown={ this.handleMouseDown }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                <div
                    ref={ (slider) => {
                        (this.slider = slider);
                    } }
                    className={ cx(uuiSlider.slider) }
                />
                <div className={ uuiSlider.filled } style={ { width: filledOffset } } />
                <SliderScale
                    handleOffset={ filledOffset }
                    slider={ this.slider }
                    min={ this.props.min }
                    max={ this.props.max }
                    splitAt={ this.props.splitAt }
                    valueWidth={ valueWidth }
                    renderLabel={ this.props.renderLabel }
                />
                <SliderHandle
                    cx={ this.props.cx }
                    isActive={ this.state.isActive }
                    tooltipContent={ normValue }
                    offset={ filledOffset }
                    onKeyDownUpdate={ (type) => this.handleKeyDownUpdate(type) }
                    onUpdate={ (mouseX: number) => this.props.onValueChange(this.getValue(mouseX, valueWidth)) }
                    handleActiveState={ (newValue) => this.setState({ isActive: newValue }) }
                    showTooltip={ this.props.showTooltip !== undefined ? this.props.showTooltip : true }
                    rawProps={ {
                        'aria-label': this.props.rawProps ? this.props.rawProps['aria-label'] : undefined,
                        'aria-valuenow': this.props.value,
                        'aria-valuemin': this.props.min,
                        'aria-valuemax': this.props.max,
                        role: 'slider',
                    } }
                />
            </div>
        );
    }
}
