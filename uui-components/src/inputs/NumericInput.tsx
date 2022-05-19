import * as React from 'react';
import {
    IHasRawProps,
    cx,
    getCalculatedValue,
    IHasCX,
    IClickable,
    IDisableable,
    IEditable,
    IHasPlaceholder,
    Icon,
    uuiMod,
    uuiElement,
    CX,
    ICanBeReadonly,
    IAnalyticableOnChange,
    UuiContexts,
    UuiContext,
    IHasForwardedRef,
    ICanFocus,
    uuiMarkers,
    getMinMaxValidatedValue,
    getSeparatedValue,
} from '@epam/uui-core';
import { IconContainer } from '../layout';
import * as css from './NumericInput.scss';

export interface ICanBeFormatted<T> {
    formatter?(value: T): T;
}

export interface NumericInputProps extends ICanFocus<HTMLInputElement>, IHasCX, IClickable, IDisableable, ICanBeFormatted<number>, IEditable<number | null>, IHasPlaceholder, ICanBeReadonly, IAnalyticableOnChange<number>, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    max?: number;
    min?: number;
    upIcon?: Icon;
    downIcon?: Icon;
    step?: number;
    inputCx?: CX;
    id?: string;
    disableArrows?: boolean;
    align?: "left" | "right";
    withThousandSeparator?: boolean;
}

export interface NumericInputState {
    value: string;
    inFocus?: boolean;
}

export const uuiNumericInput = {
    upButton: "uui-numeric-input-up-button",
    downButton: "uui-numeric-input-down-button",
    buttonGroup: "uui-numeric-input-button-group",
} as const;

const getInitStateValue = (value: number, placeholder?: string) => {
    if (!value && value !== 0) return placeholder || "0";
    return value.toString();
};

export class NumericInput extends React.Component<NumericInputProps, NumericInputState> {
    static contextType = UuiContext;
    context: UuiContexts;

    state = {
        value: getInitStateValue(this.props.value, this.props.placeholder),
        inFocus: false,
    };

    componentDidUpdate(prevProps: Readonly<NumericInputProps>, prevState: Readonly<NumericInputState>): void {
        const { value } = this.props;
        if (prevProps.value !== value && !this.state.inFocus) {
            const [formattedValue, stateValue] = this.getFormattedValues(value);
            this.setState({ value: stateValue });
            this.props.onValueChange(formattedValue);
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? null : +e.target.value;
        this.props.onValueChange(value);
    }

    handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        this.setState({ inFocus: true });
        this.props.onFocus?.(event);
    }

    getFormattedValues = (value?: number | null): [number, string] => {
        let formattedValue: number = null;
        let stateValue: string = this.props.placeholder || "";
        if (!value && value !== 0) return [formattedValue, stateValue];
        const { min, max, formatter, withThousandSeparator } = this.props;
        formattedValue = getMinMaxValidatedValue({ value, min, max });
        if (formatter) {
            formattedValue = formatter(formattedValue);
        }
        stateValue = withThousandSeparator ? getSeparatedValue(formattedValue) : formattedValue.toString();
        return [formattedValue, stateValue];
    }

    handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const [value, stateValue] = this.getFormattedValues(this.props.value);
        this.setState({ value: stateValue, inFocus: false });
        if (value !== this.props.value) this.props.onValueChange(value);
        this.props.onBlur?.(event);
        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    handleIncreaseValue = () => {
        const { value: propsValue = null, min, max, step } = this.props;
        const increasedValue = getCalculatedValue({ value: +propsValue, step, action: "incr" });
        const value = getMinMaxValidatedValue({ value: increasedValue, min, max });
        this.props.onValueChange(value);
        this.setState({ value: value.toString() });
    }

    handleDecreaseValue = () => {
        const { value: propsValue = null, min, max, step } = this.props;
        const decreasedValue = getCalculatedValue({ value: +propsValue, step, action: "decr" });
        const value = getMinMaxValidatedValue({ value: decreasedValue, min, max });
        this.props.onValueChange(value);
        this.setState({ value: value.toString() });
    }

    handleArrowKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            this.handleIncreaseValue();
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            this.handleDecreaseValue();
        }
    }

    render() {
        const { placeholder: placeholderProps, value: propsValue } = this.props;
        const { inFocus, value: stateValue } = this.state;
        const value = inFocus ? propsValue : '';
        const placeholder = !inFocus ? stateValue : placeholderProps;
        const isPlaceholderColored = propsValue || propsValue === 0;
        return (
            <div
                className={ cx(css.container, uuiElement.inputBox,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isInvalid && uuiMod.invalid,
                    (!this.props.isReadonly && this.state.inFocus) && uuiMod.focus,
                    (!this.props.isReadonly && !this.props.isDisabled) && uuiMarkers.clickable,
                    this.props.cx,
                ) }
                onClick={ this.props.onClick }
                onBlur={ this.handleBlur }
                onFocus={ this.handleFocus }
                onKeyDown={ this.handleArrowKeyDown }
                tabIndex={ -1 }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                <input
                    type="number"
                    className={ cx(uuiElement.input, this.props.inputCx, this.props.align === "right" && css.alignRight, isPlaceholderColored && uuiElement.placeholderColored) }
                    disabled={ this.props.isDisabled }
                    readOnly={ this.props.isReadonly }
                    tabIndex={ (this.state.inFocus || this.props.isReadonly || this.props.isDisabled) ? -1 : 0 }
                    aria-required={ this.props.isRequired }
                    value={ value }
                    inputMode="numeric"
                    placeholder={ placeholder || "0" }
                    onChange={ this.handleChange }
                    min={ this.props.min || 0 }
                    max={ this.props.max }
                    step={ this.props.step || 1 }
                    id={ this.props.id }
                />

                { !this.props.disableArrows && (
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
                ) }
            </div>
        );
    }
}