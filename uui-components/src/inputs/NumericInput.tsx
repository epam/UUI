import * as React from 'react';
import {
    IHasRawProps, cx, getCalculatedValue, IHasCX, IClickable, IDisableable, IEditable, IHasPlaceholder, Icon, uuiMod, uuiElement,
    CX, ICanBeReadonly, IAnalyticableOnChange, IHasForwardedRef, ICanFocus, uuiMarkers, getMinMaxValidatedValue, getSeparatedValue, useUuiContext,
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

export const uuiNumericInput = {
    upButton: "uui-numeric-input-up-button",
    downButton: "uui-numeric-input-down-button",
    buttonGroup: "uui-numeric-input-button-group",
} as const;

export const NumericInput = (props: NumericInputProps) => {
    const context = useUuiContext();

    const [inFocus, setInFocus] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (props.value !== formattedValue && !inFocus) {
            props.onValueChange(formattedValue);
        }
    }, [props.value, inFocus]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === "" ? null : +event.target.value;
        props.onValueChange(value);
        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(value, props.value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setInFocus(true);
        props.onFocus?.(event);
    };

    const [formattedValue, placeholderValue] = React.useMemo((): [number, string] => {
        const { placeholder = "0", value, min, max, formatter, withThousandSeparator } = props;
        let formattedValue: number = null;
        let placeholderValue: string = placeholder;
        if (!value && value !== 0) return [formattedValue, placeholderValue];
        formattedValue = getMinMaxValidatedValue({ value, min, max });
        if (formatter) {
            formattedValue = formatter(formattedValue);
        }
        placeholderValue = withThousandSeparator ? getSeparatedValue(formattedValue) : formattedValue.toString();
        return [formattedValue, placeholderValue];
    }, [props.value, props.max, props.min, props.formatter, props.withThousandSeparator, props.placeholder, inFocus]);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setInFocus(false);
        props.onValueChange(formattedValue);
        props.onBlur?.(event);
    };

    const handleIncreaseValue = () => {
        const { value: propsValue = null, min, max, step } = props;
        const increasedValue = getCalculatedValue({ value: +propsValue, step, action: "incr" });
        const value = getMinMaxValidatedValue({ value: increasedValue, min, max });
        props.onValueChange(value);
    };

    const handleDecreaseValue = () => {
        const { value: propsValue = null, min, max, step } = props;
        const decreasedValue = getCalculatedValue({ value: +propsValue, step, action: "decr" });
        const value = getMinMaxValidatedValue({ value: decreasedValue, min, max });
        props.onValueChange(value);
    };

    const handleArrowKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            handleIncreaseValue();
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            handleDecreaseValue();
        }
    };

    const isPlaceholderColored = React.useMemo(() => Boolean(props.value || props.value === 0), [props.value]);
    const inputValue = React.useMemo(() => (inFocus && (props.value || props.value === 0)) ? props.value : "", [props.value, inFocus]);

    return (
        <div
            className={ cx(css.container, uuiElement.inputBox,
                props.isReadonly && uuiMod.readonly,
                props.isDisabled && uuiMod.disabled,
                props.isInvalid && uuiMod.invalid,
                (!props.isReadonly && inFocus) && uuiMod.focus,
                (!props.isReadonly && !props.isDisabled) && uuiMarkers.clickable,
                props.cx,
            ) }
            onClick={ props.onClick }
            onBlur={ handleBlur }
            onFocus={ handleFocus }
            onKeyDown={ handleArrowKeyDown }
            tabIndex={ -1 }
            ref={ props.forwardedRef }
            { ...props.rawProps }
        >
            <input
                type="number"
                className={ cx(uuiElement.input, props.inputCx, props.align === "right" && css.alignRight, isPlaceholderColored && uuiElement.placeholderColored) }
                disabled={ props.isDisabled }
                readOnly={ props.isReadonly }
                tabIndex={ (inFocus || props.isReadonly || props.isDisabled) ? -1 : 0 }
                aria-required={ props.isRequired }
                value={ inputValue }
                inputMode="numeric"
                placeholder={ placeholderValue }
                onChange={ handleChange }
                min={ props.min || 0 }
                max={ props.max }
                step={ props.step || 'any' }
                id={ props.id }
            />

            { !props.disableArrows && (
                <div className={ uuiNumericInput.buttonGroup }>
                    <IconContainer
                        cx={ cx(uuiNumericInput.upButton, (props.isReadonly || props.isDisabled) && css.hidden) }
                        icon={ props.upIcon }
                        onClick={ handleIncreaseValue }
                        isDisabled={ props.isDisabled }
                    />
                    <IconContainer
                        cx={ cx(uuiNumericInput.downButton, (props.isReadonly || props.isDisabled) && css.hidden) }
                        icon={ props.downIcon }
                        onClick={ handleDecreaseValue }
                        isDisabled={ props.isDisabled }
                    />
                </div>
            ) }
        </div>
    );
};