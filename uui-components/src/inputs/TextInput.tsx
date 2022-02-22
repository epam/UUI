import * as React from 'react';
import { Icon, uuiMod, uuiElement, uuiMarkers, CX, TextInputCoreProps, cx, useUuiContext } from '@epam/uui-core';
import { IconContainer } from '../layout';
import * as css from './TextInput.scss';

const ENTER = 'Enter';
const ESCAPE = 'Escape';

export type IRenderInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export interface TextInputProps extends TextInputCoreProps {
    acceptIcon?: Icon;
    cancelIcon?: Icon;
    dropdownIcon?: Icon;
    inputCx?: CX;
    renderInput?: (props: IRenderInputProps) => JSX.Element;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const context = useUuiContext();
    const [inFocus, setInFocus] = React.useState<boolean>(false);
    const inputElement = React.useRef<HTMLInputElement>();
    const inputContainer = React.useRef<HTMLDivElement>();

    React.useImperativeHandle(ref, () => inputElement.current, [inputElement.current]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onValueChange(e.target.value);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(e.target.value, props.value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(e);
        if (e.key === ENTER)  props.onAccept?.();
        else if (e.key === ESCAPE) props.onCancel?.();
    };

    const handleFocus = () => {
        setInFocus(true);
        props.onFocus?.();
    };

    const handleBlur = (e: React.SyntheticEvent<HTMLElement>) => {
        !props.isReadonly && props.onBlur?.(e);
        setInFocus(false);
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

    const getInputProps = () => ({
        type: props.type || "text",
        className: cx(uuiElement.input, props.inputCx),
        disabled: props.isDisabled,
        placeholder: props.placeholder,
        value: props.value || '',
        readOnly: props.isReadonly,
        onKeyDown: handleKeyDown,
        onChange: handleChange,
        autoFocus: props.autoFocus,
        ref: inputElement,
        autoComplete: props.autoComplete,
        name: props.name,
        maxLength: props.maxLength,
        inputMode: props.inputMode,
        tabIndex: props.tabIndex,
        id: props.id,
        required: props.isRequired,
        'aria-invalid': props.isInvalid,
        'aria-required': props.isRequired,
        'aria-disabled': props.isDisabled,
        'aria-readonly': props.isReadonly,
    });

    const icon = props.icon && <IconContainer icon={ props.icon } onClick={ props.onIconClick } />;
    const showIconsOnAction = props.value && !props.isReadonly && !props.isDisabled;

    return (
        <div onClick={ props.onClick && handleClick } ref={ inputContainer } className={
            cx(
                css.container,
                uuiElement.inputBox,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                props.isInvalid && uuiMod.invalid,
                (!props.isReadonly && !props.isDisabled) && uuiMarkers.clickable,
                (!props.isReadonly && inFocus) && uuiMod.focus,
                props.cx,
            ) }
            onFocus={ handleFocus }
            onBlur={ handleBlur }
            tabIndex={ -1 }
            { ...props.rawProps }
        >
            { props.prefix && <span className={ uuiElement.prefixInput }>{ props.prefix }</span> }
            { props.iconPosition !== 'right' && icon }
            { props.renderInput ? props.renderInput(getInputProps()) : <input { ...getInputProps() } /> }
            { props.onAccept && showIconsOnAction && <IconContainer
                cx={ cx('uui-icon-accept') }
                isDisabled={ props.isDisabled }
                icon={ props.acceptIcon }
                onClick={ props.onAccept }
            /> }
            { props.onCancel && showIconsOnAction && <IconContainer
                cx={ cx('uui-icon-cancel', uuiMarkers.clickable) }
                isDisabled={ props.isDisabled }
                icon={ props.cancelIcon }
                onClick={ handleCancel }
            /> }
            { props.suffix && <span className={ uuiElement.suffixInput }>{ props.suffix }</span> }
            { props.iconPosition === 'right' && icon }
            { props.isDropdown && <IconContainer
                cx={ cx((props.isReadonly || props.isDisabled) && css.hidden, uuiMarkers.clickable) }
                icon={ props.dropdownIcon }
                flipY={ props.isOpen }
            /> }
        </div>
    );
});