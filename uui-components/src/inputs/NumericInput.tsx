import * as React from 'react';
import cx from 'classnames';
import * as css from './NumericInput.scss';
import {IHasCX, IClickable, IDisableable, IEditable, IHasPlaceholder, Icon, uuiMod, uuiElement, CX, ICanBeReadonly, IAnalyticableOnChange, uuiContextTypes, UuiContexts} from '@epam/uui';
import {IconContainer} from '../layout';

export interface NumericInputProps extends IHasCX, IClickable, IDisableable, IEditable<number | null>, IHasPlaceholder, ICanBeReadonly, IAnalyticableOnChange<number> {
    max: number;
    min: number;
    upIcon?: Icon;
    downIcon?: Icon;
    step?: number;
    inputCx?: CX;
}

export interface NumericInputState {
    value: string;
    inFocus?: boolean;
}

export const uuiNumericInput = {
    upButton: 'uui-numeric-input-up-button',
    downButton: 'uui-numeric-input-down-button',
    buttonGroup: 'uui-numeric-input-button-group',
};

export class NumericInput extends React.Component<NumericInputProps, NumericInputState> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    state = {
        value: this.props.value !== null && this.props.value !== undefined && !Number.isNaN(this.props.value) ? this.props.value.toString() : '',
        inFocus: false,
    };

    componentDidUpdate(prevProps: Readonly<NumericInputProps>, prevState: Readonly<NumericInputState>): void {
        if (prevProps.value !== this.props.value && this.props.value !== +prevState.value) {
            this.setState({value: this.props.value ? this.getValidatedValue(this.props.value).toString() : ''});
        }
    }

    getValidatedValue = (value: number) => {
        const {min, max} = this.props;

        if (value > max) {
            return max;
        } else if (value < min) {
            return min;
        } else {
            return value;
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({value: e.target.value});
    }

    handleFocus = () => this.setState({inFocus: true});

    handleBlur = () => {
        let value: number | null;

        if (this.state.value === '') {
            value = null;
            this.props.onValueChange(value);
            this.setState({value: ''});
        } else {
            value = this.getValidatedValue(+this.state.value);
            this.props.onValueChange(value);
            this.setState({value: value.toString()});
        }
        this.setState({inFocus: false});

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    handleIncreaseValue = () => {
        const value = this.getValidatedValue(+this.state.value + (this.props.step || 1));
        this.props.onValueChange(value);
        this.setState({value: value.toString()});
    }

    handleDecreaseValue = () => {
        const value = this.getValidatedValue(+this.state.value - (this.props.step || 1));
        this.props.onValueChange(value);
        this.setState({value: value.toString()});
    }

    handleArrowKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.handleIncreaseValue();
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.handleDecreaseValue();
        }
    }

    render() {
        return (
            <div
                className={ cx(css.container, uuiElement.inputBox,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isInvalid && uuiMod.invalid,
                    (!this.props.isReadonly && this.state.inFocus) && uuiMod.focus,
                    this.props.cx) }
                onClick={ this.props.onClick }
                onBlur={ this.handleBlur }
                onFocus={ this.handleFocus }
                onKeyDown={ this.handleArrowKeyDown }
                tabIndex={ -1 }
            >
                <input
                    type="number"
                    className={ cx(uuiElement.input, this.props.inputCx) }
                    disabled={ this.props.isDisabled }
                    readOnly={ this.props.isReadonly }
                    value={ this.state.value }
                    placeholder={ this.props.placeholder || '0' }
                    onChange={ this.handleChange }
                    min={ this.props.min || 0 }
                    max={ this.props.max }
                    step={ this.props.step || 1 }
                />
                <div className={ uuiNumericInput.buttonGroup }>
                    <IconContainer
                        cx={ cx(uuiNumericInput.upButton, (this.props.isReadonly || this.props.isDisabled) && css.hidden) }
                        icon={ this.props.upIcon }
                        onClick={ this.handleIncreaseValue }
                        isDisabled={ this.props.isDisabled }
                    />
                    <IconContainer
                        cx={ cx(uuiNumericInput.downButton, (this.props.isReadonly || this.props.isDisabled) && css.hidden) }
                        icon={ this.props.downIcon }
                        onClick={ this.handleDecreaseValue }
                        isDisabled={ this.props.isDisabled }
                    />
                </div>
            </div>
        );
    }
}