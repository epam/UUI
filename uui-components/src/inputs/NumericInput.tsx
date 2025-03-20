import * as React from 'react';
import { IHasRawProps, cx, getCalculatedValue, IHasCX, IClickable, IDisableable, IEditable, IHasPlaceholder, Icon,
    uuiMod, uuiElement, CX, ICanBeReadonly, IAnalyticableOnChange, ICanFocus, uuiMarkers, getMinMaxValidatedValue,
    getSeparatedValue, useUuiContext, i18n, preventDefaultIfTargetFocused,
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
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Maximum value (default is Number.MAX_SAFE_INTEGER) */
    max?: number;

    /**
     * Minimum value (default is 0)
     * @default 0
     */
    min?: number;

    /** Overrides the up/increase icon */
    upIcon?: Icon;

    /** Overrides the down/decrease icon */
    downIcon?: Icon;

    /** Increase/decrease step on up/down icons clicks and up/down arrow keys */
    step?: number;

    /** CSS classes to put directly on the Input element */
    inputCx?: CX;

    /** HTML ID */
    id?: string;

    /** Turn off up/down (increase/decrease) buttons */
    disableArrows?: boolean;

    /** Align text inside the component. Useful for tables (in cell-mode) - to align numbers in table column */
    align?: 'left' | 'center' | 'right';

    /**
     * Turns off locale-based formatting, standard Number.toString() is used instead
     * @default false
     */
    disableLocaleFormatting?: boolean;

    /** Number formatting options. See #{link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat} */
    formatOptions?: Intl.NumberFormatOptions;

    /**
     * A function to convert current input value to displayed text.
     * Overrides standard Intl-based formatting.
     * If passed, only maximumFractionDigits considered from formatOptions when both properties provided.
     * Formatting is applied only when input is not focused.
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

export const NumericInput = React.forwardRef<HTMLDivElement, NumericInputProps>((props, ref) => {
    const {
        value: initialValue = null,
        min: initialMin,
        max: initialMax,
        formatOptions: initialFormatOptions,
        step,
        formatValue,
    } = props;

    const value = initialValue != null ? +initialValue : null;
    const min = initialMin ?? 0;
    const max = initialMax ?? Number.MAX_SAFE_INTEGER;
    const formatOptions = initialFormatOptions ?? { maximumFractionDigits: 0 };

    const placeholderValue = React.useMemo(() => {
        if (typeof value === 'number') {
            if (formatValue) return formatValue(value);
            return props.disableLocaleFormatting ? value.toString() : getSeparatedValue(value, formatOptions, i18n.locale);
        }

        return props.placeholder || '0';
    }, [
        props.placeholder, props.disableLocaleFormatting, formatOptions, value,
    ]);

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
            const analyticsEvent = props.getValueChangeAnalyticsEvent(newValue, props.value);
            context.uuiAnalytics.sendEvent(analyticsEvent);
        }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setInFocus(true);
        props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setInFocus(false);

        // clearing the input when entering invalid data using special characters
        if (inputRef.current && event.target.validity?.badInput) {
            inputRef.current.value = '';
        } else {
            if (value !== null) {
                const validatedValue = getMinMaxValidatedValue({ value, min, max });
                if (validatedValue !== value) {
                    props.onValueChange(validatedValue);
                }
            }
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
        const otherKeysArePressed = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
        if (e.key === 'ArrowUp' && !otherKeysArePressed) {
            e.preventDefault();
            handleIncreaseValue();
        }
        if (e.key === 'ArrowDown' && !otherKeysArePressed) {
            e.preventDefault();
            handleDecreaseValue();
        }
    };

    const inputRef = React.useRef<HTMLInputElement>(null);

    // disable changing the value by scrolling the wheel when the input is in focus and hover
    React.useEffect(() => {
        inputRef?.current?.addEventListener('wheel', preventDefaultIfTargetFocused, { passive: false });

        return () => {
            inputRef?.current?.removeEventListener('wheel', preventDefaultIfTargetFocused);
        };
    }, []);

    const isPlaceholderColored = React.useMemo(() => Boolean(props.value || props.value === 0), [props.value]);
    const inputValue = React.useMemo(() => (inFocus && (props.value || props.value === 0) ? props.value : ''), [props.value, inFocus]);

    const showArrows = !props.disableArrows && !props.isReadonly && !props.isDisabled;

    const handleWrapperFocus = () => {
        inputRef.current?.focus();
    };

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
            onFocus={ handleWrapperFocus }
            onKeyDown={ handleArrowKeyDown }
            tabIndex={ -1 }
            ref={ ref }
            { ...props.rawProps }
        >
            <input
                type="number"
                className={ cx(
                    uuiElement.input,
                    props.inputCx,
                    css[`align-${props.align}`],
                    isPlaceholderColored && uuiElement.valueInPlaceholder,
                ) }
                disabled={ props.isDisabled }
                readOnly={ props.isReadonly }
                tabIndex={ inFocus || props.isReadonly || props.isDisabled ? -1 : 0 }
                aria-required={ props.isRequired }
                value={ inputValue }
                inputMode="numeric"
                placeholder={ placeholderValue }
                onChange={ handleChange }
                onFocus={ handleFocus }
                onBlur={ handleBlur }
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
});
