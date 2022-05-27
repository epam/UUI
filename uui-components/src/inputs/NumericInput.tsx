import * as React from 'react';
import {
    IHasRawProps, cx, getCalculatedValue, IHasCX, IClickable, IDisableable, IEditable, IHasPlaceholder, Icon, uuiMod, uuiElement,
    CX, ICanBeReadonly, IAnalyticableOnChange, IHasForwardedRef, ICanFocus, uuiMarkers, getMinMaxValidatedValue, getSeparatedValue, useUuiContext,
    i18n,
} from '@epam/uui-core';
import { IconContainer } from '../layout';
import * as css from './NumericInput.scss';

export interface NumericInputProps extends ICanFocus<HTMLInputElement>, IHasCX, IClickable, IDisableable, IEditable<number | null>, IHasPlaceholder, ICanBeReadonly, IAnalyticableOnChange<number>, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    max?: number;
    min?: number;
    upIcon?: Icon;
    downIcon?: Icon;
    step?: number;
    inputCx?: CX;
    id?: string;
    disableArrows?: boolean;
    align?: "left" | "right";
    disableThousandSeparator?: boolean;
    formatOptions?: Intl.NumberFormatOptions;
    // Obsolete! Made obsolete at 25-May-2022. TBD: Remove in next releases
    /**
     * [Obsolete]: Please rework this to change value in lens.onChange or onValueChange instead
     */
    formatter?(value: number): number;
}

export const uuiNumericInput = {
    upButton: "uui-numeric-input-up-button",
    downButton: "uui-numeric-input-down-button",
    buttonGroup: "uui-numeric-input-button-group",
} as const;

const getFractionDigits = (formatOptions: Intl.NumberFormatOptions) => {
    const { maximumFractionDigits } = new Intl.NumberFormat(i18n.locale, formatOptions).resolvedOptions();
    return maximumFractionDigits;
};

export const NumericInput = (props: NumericInputProps) => {
    const context = useUuiContext();

    const [inFocus, setInFocus] = React.useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { formatter, formatOptions } = props;
        let value = event.target.value === "" ? null : +event.target.value;
        const fractionDigits = getFractionDigits(formatOptions);
        if (value !== null) {
            value = +value.toFixed(fractionDigits);
        }
        if (formatter) {
            value = formatter(value);
        }
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

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { value, min, max } = props;
        setInFocus(false);
        const validatedValue = getMinMaxValidatedValue({ value, min, max });
        if (validatedValue !== value) props.onValueChange(validatedValue);
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

    const placeholderValue = React.useMemo(() => {
        const { placeholder, value, formatOptions, disableThousandSeparator } = props;
        if (!value && value !== 0) return placeholder || "0";
        return  disableThousandSeparator ? value.toString() : getSeparatedValue(value, formatOptions, i18n.locale);
    }, [props.placeholder, props.value, props.formatOptions, props.disableThousandSeparator]);

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