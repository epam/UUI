import * as React from 'react';
import {
    Icon, uuiMod, uuiElement, uuiMarkers, CX, TextInputCoreProps, cx, useUuiContext,
} from '@epam/uui-core';
import { IconButton } from '../buttons';
import { IconContainer } from '../layout';
import { browserBugFixDirAuto } from '../helpers/browserBugFixDirAuto';
import css from './TextInput.module.scss';

import type { JSX } from 'react';

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

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const context = useUuiContext();
    const [inFocus, setInFocus] = React.useState<boolean>(false);
    const inputElement = React.useRef<HTMLInputElement>(undefined);

    React.useImperativeHandle(ref, () => inputElement.current, [inputElement.current]);

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

    const handleCancel = () => {
        props.onCancel();
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
        onClick: props.onClick,
        tabIndex: (props.isReadonly || props.isDisabled) ? -1 : props.tabIndex || 0,
        id: props.id,
        required: props.isRequired,
        'aria-invalid': props.isInvalid,
        'aria-disabled': props.isDisabled,
        dir: props?.rawProps?.dir === 'auto'
            ? browserBugFixDirAuto(props.value || props.placeholder)
            : props?.rawProps?.dir, // TODO: remove after browser bug fix
    });

    const icon = props.icon && <IconContainer icon={ props.icon } onClick={ props.onIconClick } />;
    const showIconsOnAction = props.value && !props.isReadonly && !props.isDisabled;

    return (
        <div
            className={ cx(
                css.container,
                uuiElement.inputBox,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                props.isInvalid && uuiMod.invalid,
                !props.isReadonly && inFocus && uuiMod.focus,
                props.cx,
            ) }
            { ...props.rawProps }
        >
            {props.iconPosition !== 'right' && icon}
            {props.renderInput ? props.renderInput(getInputProps()) : <input { ...getInputProps() } />}
            {props.onAccept && showIconsOnAction && (
                <IconContainer cx={ cx('uui-icon-accept') } isDisabled={ props.isDisabled } icon={ props.acceptIcon } onClick={ props.onAccept } rawProps={ { role: 'button' } } />
            )}
            {props.onCancel && showIconsOnAction && (
                <IconButton
                    cx={ cx('uui-icon-cancel', css.clearButton, uuiMarkers.clickable) }
                    isDisabled={ props.isDisabled }
                    icon={ props.cancelIcon }
                    onClick={ handleCancel }
                    rawProps={ {
                        'aria-label': 'Clear input',
                    } }
                />
            )}
            {props.iconPosition === 'right' && icon}
            {props.isDropdown && (
                <IconContainer cx={ cx((props.isReadonly || props.isDisabled) && css.hidden, css.pointer) } icon={ props.dropdownIcon } flipY={ props.isOpen } />
            )}
        </div>
    );
});
