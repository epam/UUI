import cx from 'classnames';
import * as React from 'react';
import { uuiMod } from '@epam/uui';
import { SliderBase, uuiSlider, SliderBaseState } from './SliderBase';
import * as css from './SliderBase.scss';
import { SliderHandle } from './SliderHandle';
import { RangeSliderScale } from './RangeSliderScale';

export interface RangeSliderValue {
    from: number;
    to: number;
}

export interface RangeSliderState extends SliderBaseState {
    activeHandle: string | null;
}

export class RangeSlider extends SliderBase<RangeSliderValue, RangeSliderState> {
    state = {
        isActive: false,
        valueWidth: 0,
        activeHandle: '',
    };

    normalize(value: number) {
        if (!value && value != 0) {
            return this.props.min;
        }

        return value > this.props.max ? this.props.max : value < this.props.min ? this.props.min : value;
    }

    onHandleValueChange = (mouseX: number, handleType: string, valueWidth?: number) => {
        if (!this.state.activeHandle) {
            this.setState({ activeHandle: handleType });
        }
        if (this.getValue(mouseX, valueWidth) > this.props.value.to && this.state.activeHandle === 'from') {
            this.props.onValueChange({ from: this.props.value.to, to: this.props.value.to });
            this.setState({ activeHandle: 'to' });
        } else if (this.props.value.from > this.getValue(mouseX, valueWidth) && this.state.activeHandle === 'to') {
            this.props.onValueChange({ from: this.props.value.from, to: this.props.value.from });
            this.setState({ activeHandle: 'from' });
        }
        switch (this.state.activeHandle) {
            case 'from': this.props.onValueChange({ from: this.getValue(mouseX, valueWidth), to: this.props.value && this.props.value.to || this.props.min }); break;
            case 'to': this.props.onValueChange({ from: this.props.value && this.props.value.from || this.props.min, to: this.getValue(mouseX, valueWidth) }); break;
        }
    }

    handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.props.value.to - this.getValue(e.clientX, this.getValueWidth()) > this.getValue(e.clientX, this.getValueWidth()) - this.props.value.from) {
            this.props.onValueChange({ from: this.getValue(e.clientX, this.getValueWidth()), to: this.props.value.to });
        } else {
            this.props.onValueChange({ from: this.props.value.from, to: this.getValue(e.clientX, this.getValueWidth()) });
        }
    }

    getValueWidth() {
        return this.slider ? this.slider.offsetWidth / (this.props.max - this.props.min) : 0;
    }

    render() {
        let from = (this.props.value && this.props.value.from != null) ? this.props.value.from : this.props.min;
        let to = (this.props.value && this.props.value.to != null) ? this.props.value.to : this.props.max;
        let normValueFrom = this.roundToStep(this.normalize(from), this.props.step);
        let normValueTo = this.roundToStep(this.normalize(to), this.props.step);
        let valueWidth = this.getValueWidth();

        const fromHandleOffset = (normValueFrom - this.props.min) * valueWidth;
        const toHandleOffset = (normValueTo - this.props.min) * valueWidth;

        return (
            <div className={ cx(uuiSlider.container, css.root, this.props.isDisabled && uuiMod.disabled, this.props.cx) } onClick={ this.handleMouseClick }>
                <div
                    ref={ slider => this.slider = slider }
                    className={ cx(uuiSlider.slider, this.state.activeHandle && uuiMod.active) }
                />
                <div
                    className={ uuiSlider.filled }
                    style={ {
                        width: (normValueFrom < normValueTo ? normValueTo - normValueFrom : normValueFrom - normValueTo) * valueWidth,
                        left: (normValueFrom < normValueTo ? normValueFrom - this.props.min : normValueTo - this.props.min) * valueWidth,
                    } }
                />
                <RangeSliderScale
                    handleOffset={ { from: fromHandleOffset, to: toHandleOffset } }
                    slider={ this.slider }
                    min={ this.props.min }
                    max={ this.props.max }
                    splitAt={ this.props.splitAt }
                    valueWidth={ valueWidth }
                />
                <SliderHandle
                    cx={ this.props.cx }
                    isActive={ this.state.activeHandle === 'from' }
                    offset={ fromHandleOffset }
                    tooltipContent={ normValueFrom }
                    onUpdate={ (mouseX: number) => this.onHandleValueChange(mouseX, 'from', valueWidth) }
                    handleActiveState={ (isActive) => this.setState({ activeHandle: isActive ? 'from' : null }) }
                />
                <SliderHandle
                    cx={ this.props.cx }
                    isActive={ this.state.activeHandle === 'to' }
                    offset={ toHandleOffset }
                    tooltipContent={ normValueTo }
                    onUpdate={ (mouseX: number) => this.onHandleValueChange(mouseX, 'to', valueWidth) }
                    handleActiveState={ (isActive) => this.setState({ activeHandle: isActive ? 'to' : null }) }
                />
            </div>
        );
    }
}
