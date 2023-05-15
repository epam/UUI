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
    IHasForwardedRef,
    ICanFocus,
    uuiMarkers,
    getMinMaxValidatedValue,
    getSeparatedValue,
    useUuiContext,
    i18n,
} from '@epam/uui-core';
import { IconContainer } from '../layout';
import css from './NumericInput.module.scss';

export interface NumericInputProps
    extends ICanFocus<HTMLInputElement>,
    IHasCX,
    IClickable,
    IDisableable,
    IEditable<number | null>,
    IHasPlaceholder,
    ICanBeReadonly,
    IAnalyticableOnChange<number>,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    IHasForwardedRef<HTMLDivElement> {
    /** Maximum value (default is Number.MAX_SAFE_INTEGER) */
    max?: number;

    /** Minimum value (default is 0) */
    min?: number;

    /** Overrides the up/increase icon */
    upIcon?: Icon;

    /** Overrides the down/decrease icon */
    downIcon?: Icon;

    /** Increase/decrease step (for icons and ) */
    step?: number;

    /** CSS classes to put directly on the Input element */
    inputCx?: CX;

    /** HTML ID */
    id?: string;

    /** Turn off up/down (increase/decrease) buttons */
    disableArrows?: boolean;

    /** Align text inside the component. Useful for tables (in cell-mode) - to align numbers in table column */
    align?: 'left' | 'right';

    /** Turns off locale-based formatting, standard Number.toString() is used instead */
    disableLocaleFormatting?: boolean;

    /** Number formatting options. See #{link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat} */
    formatOptions?: Intl.NumberFormatOptions;

    /**
     * A function to convert current input value to displayed text.
     * Overrides standard Intl-based formatting.
     * If passed, only maximumFractionDigits considered from formatOptions when both properties provided.
     * Note, that formatting is used when input is out of focus.
     */
    formatValue?(value: number): string;
}

export const uuiNumericInput = {
    upButton: 'uui-numeric-input-up-button',
    downButton: 'uui-numeric-input-down-button',
    buttonGroup: 'uui-numeric-input-button-group',
    withoutArrows: 'uui-numeric-input-without-arrows',
} as const;

const getFractionDigits = (formatOptions: Intl.NumberFormatOptions) => {
    const { maximumFractionDigits } = new Intl.NumberFormat(i18n.locale, formatOptions).resolvedOptions();
    return maximumFractionDigits;
};

export function NumericInput(props: NumericInputProps) {
    let {
        value, min, max, step, formatValue, formatOptions,
    } = props;

    if (value != null) {
        value = +value;
    }

    min = min ?? 0;
    max = max ?? Number.MAX_SAFE_INTEGER;
    formatOptions = formatOptions ?? { maximumFractionDigits: 0 };

    const context = useUuiContext();

    const [inFocus, setInFocus] = React.useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value === '' ? null : +event.target.value;
        const fractionDigits = getFractionDigits(formatOptions);
        if (newValue !== null) {
            newValue = +newValue.toFixed(fractionDigits);
        }

        props.onValueChange(newValue);
        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, props.value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setInFocus(true);
        props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setInFocus(false);

        // clearing the input when entering invalid data using special characters
        if (event.target.validity?.badInput) {
            inputRef.current.value = '';
        } else {
            const validatedValue = getMinMaxValidatedValue({ value, min, max });
            if (validatedValue !== props.value) props.onValueChange(validatedValue);
        }

        props.onBlur?.(event);
    };

    const handleIncreaseValue = () => {
        let newValue = getCalculatedValue({ value, step, action: 'incr' });
        newValue = getMinMaxValidatedValue({ value: newValue, min, max });
        props.onValueChange(newValue);
    };

    const handleDecreaseValue = () => {
        let newValue = getCalculatedValue({ value, step, action: 'decr' });
        newValue = getMinMaxValidatedValue({ value: newValue, min, max });
        props.onValueChange(newValue);
    };

    const handleArrowKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            handleIncreaseValue();
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleDecreaseValue();
        }
    };

    const inputRef = React.useRef<HTMLInputElement>();

    // disable changing the value by scrolling the wheel when the input is in focus and hover
    React.useEffect(() => {
        const preventValueChange = (e: WheelEvent) => document.activeElement === e.target && e.preventDefault();

        inputRef?.current?.addEventListener('wheel', preventValueChange, { passive: false });

        return () => {
            inputRef?.current?.removeEventListener('wheel', preventValueChange);
        };
    }, []);

    const isPlaceholderColored = React.useMemo(() => Boolean(props.value || props.value === 0), [props.value]);
    const inputValue = React.useMemo(() => (inFocus && (props.value || props.value === 0) ? props.value : ''), [props.value, inFocus]);

    const placeholderValue = React.useMemo(() => {
        if (!value && value !== 0) return props.placeholder || '0';
        if (formatValue) return formatValue(value);

        return props.disableLocaleFormatting ? value.toString() : getSeparatedValue(value, formatOptions, i18n.locale);
    }, [
        props.placeholder, props.value, props.formatOptions, props.disableLocaleFormatting,
    ]);

    const showArrows = !props.disableArrows && !props.isReadonly && !props.isDisabled;

    return (
        <div
            className={ cx(
                css.container,
                uuiElement.inputBox,
                props.isReadonly && uuiMod.readonly,
                props.isDisabled && uuiMod.disabled,
                props.isInvalid && uuiMod.invalid,
                !props.isReadonly && inFocus && uuiMod.focus,
                !props.isReadonly && !props.isDisabled && uuiMarkers.clickable,
                !showArrows && uuiNumericInput.withoutArrows,
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
                className={ cx(uuiElement.input, props.inputCx, props.align === 'right' && css.alignRight, isPlaceholderColored && uuiElement.valueInPlaceholder) }
                disabled={ props.isDisabled }
                readOnly={ props.isReadonly }
                tabIndex={ inFocus || props.isReadonly || props.isDisabled ? -1 : 0 }
                aria-required={ props.isRequired }
                value={ inputValue }
                inputMode="numeric"
                placeholder={ placeholderValue }
                onChange={ handleChange }
                min={ min }
                max={ max }
                step={ step }
                id={ props.id }
                ref={ inputRef }
            />

            {showArrows && (
                <div className={ uuiNumericInput.buttonGroup }>
                    <IconContainer
                        cx={ uuiNumericInput.upButton }
                        icon={ props.upIcon }
                        onClick={ handleIncreaseValue }
                        isDisabled={ props.isDisabled }
                        rawProps={ { role: 'button' } }
                    />
                    <IconContainer
                        cx={ uuiNumericInput.downButton }
                        icon={ props.downIcon }
                        onClick={ handleDecreaseValue }
                        isDisabled={ props.isDisabled }
                        rawProps={ { role: 'button' } }
                    />
                </div>
            )}
        </div>
    );
}
