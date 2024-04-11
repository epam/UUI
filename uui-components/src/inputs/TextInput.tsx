import * as React from 'react';
import {
    Icon, uuiMod, uuiElement, uuiMarkers, CX, TextInputCoreProps, cx, useUuiContext,
} from '@epam/uui-core';
import { IconContainer } from '../layout';
import css from './TextInput.module.scss';

const ENTER = 'Enter';
const ESCAPE = 'Escape';

export type IRenderInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export interface TextInputProps extends TextInputCoreProps {
    /** Overrides accept (check) icon */
    acceptIcon?: Icon;
    /** Overrides cancel (cross) icon */
    cancelIcon?: Icon;
    /** Overrides dropdown (chevron) icon */
    dropdownIcon?: Icon;
    /** CSS class(es) to put to the HTML Input element */
    inputCx?: CX;
    /** overrides rendering of HTML Input element  */
    renderInput?: (props: IRenderInputProps) => JSX.Element;
}

export const TextInput = /* @__PURE__ */React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const context = useUuiContext();
    const [inFocus, setInFocus] = React.useState<boolean>(false);
    const inputElement = React.useRef<HTMLInputElement>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Android does not support maxLength
        // https://studysection.com/blog/the-html-maxlength-attribute-is-not-working-as-expected-on-android-phones/
        const targetValue = e.target.value;
        let newValue;
        if (props.maxLength && targetValue.length > props.maxLength) {
            newValue = targetValue.slice(0, props.maxLength);
        } else {
            newValue = targetValue;
        }

        props.onValueChange(newValue);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, props.value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(e);
        if (e.key === ENTER) props.onAccept?.();
        else if (e.key === ESCAPE) props.onCancel?.();
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setInFocus(true);
        props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setInFocus(false);
        props.onBlur?.(event);
    };

    const handleClick = (e: any) => {
        if (e.target.classList.contains(uuiMarkers.clickable)) {
            return e.preventDefault();
        }
        props.onClick?.(e);
    };

    const handleCancel = () => {
        props.onCancel();
        inputElement.current?.focus();
    };

    const handleWrapperFocus = () => {
        inputElement.current?.focus();
    };

    const getInputProps = () => ({
        type: props.type || 'text',
        className: cx(uuiElement.input, props.inputCx),
        disabled: props.isDisabled,
        placeholder: props.placeholder,
        value: props.value || '',
        readOnly: props.isReadonly,
        onKeyDown: handleKeyDown,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        autoFocus: props.autoFocus,
        ref: inputElement,
        autoComplete: props.autoComplete,
        name: props.name,
        maxLength: props.maxLength,
        inputMode: props.inputMode,
        tabIndex: (props.tabIndex || inFocus || props.isReadonly || props.isDisabled) ? -1 : 0,
        id: props.id,
        required: props.isRequired,
        'aria-invalid': props.isInvalid,
        'aria-disabled': props.isDisabled,
    });

    const icon = props.icon && <IconContainer icon={ props.icon } onClick={ props.onIconClick } />;
    const showIconsOnAction = props.value && !props.isReadonly && !props.isDisabled;

    return (
        <div
            onClick={ props.onClick && handleClick }
            ref={ ref }
            className={ cx(
                css.container,
                uuiElement.inputBox,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                props.isInvalid && uuiMod.invalid,
                !props.isReadonly && !props.isDisabled && uuiMarkers.clickable,
                !props.isReadonly && inFocus && uuiMod.focus,
                props.cx,
            ) }
            tabIndex={ -1 }
            onFocus={ handleWrapperFocus }
            { ...props.rawProps }
        >
            {props.iconPosition !== 'right' && icon}
            {props.renderInput ? props.renderInput(getInputProps()) : <input { ...getInputProps() } />}
            {props.onAccept && showIconsOnAction && (
                <IconContainer cx={ cx('uui-icon-accept') } isDisabled={ props.isDisabled } icon={ props.acceptIcon } onClick={ props.onAccept } rawProps={ { role: 'button' } } />
            )}
            {props.onCancel && showIconsOnAction && (
                <IconContainer
                    cx={ cx('uui-icon-cancel', uuiMarkers.clickable) }
                    isDisabled={ props.isDisabled }
                    icon={ props.cancelIcon }
                    onClick={ handleCancel }
                    rawProps={ { role: 'button' } }
                />
            )}
            {props.iconPosition === 'right' && icon}
            {props.isDropdown && (
                <IconContainer cx={ cx((props.isReadonly || props.isDisabled) && css.hidden, css.pointer) } icon={ props.dropdownIcon } flipY={ props.isOpen } />
            )}
        </div>
    );
});
