import * as React from 'react';
import { isChildFocusable, IPickerToggler, IHasIcon, IHasCX, ICanBeReadonly, Icon, uuiMod, uuiElement, uuiMarkers, DataRowProps, closest, cx, IHasRawProps } from "@epam/uui";
import { IconContainer } from '../layout';
import * as css from './PickerToggler.scss';
import { i18n } from "../../i18n";

export interface PickerTogglerProps<TItem = any, TId = any> extends IPickerToggler<TItem, TId>, IHasIcon, IHasCX, ICanBeReadonly, IHasRawProps<HTMLElement> {
    cancelIcon?: Icon;
    dropdownIcon?: Icon;
    autoFocus?: boolean;
    renderItem?(props: DataRowProps<TItem, TId>): React.ReactNode;
    getName?: (item: DataRowProps<TItem, TId>) => string;
    entityName?: string;
    maxItems?: number;
    isSingleLine?: boolean;
    pickerMode: 'single' | 'multi';
    searchPosition: 'input' | 'body' | 'none';
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    onBlur?(e: React.FocusEvent<HTMLElement>): void;
    onFocus?(e?: React.FocusEvent<HTMLElement>): void;
    disableSearch?: boolean;
    disableClear?: boolean;
    minCharsToSearch?: number;
    ref?: React.Ref<any>;
}

function PickerTogglerComponent<TItem, TId>(props: PickerTogglerProps<TItem, TId>, ref: React.ForwardedRef<HTMLElement>) {
    const [inFocus, setInFocus] = React.useState<boolean>(false);
    const [isActive, setIsActive] = React.useState<boolean>(false);

    const toggleContainer = React.useRef<HTMLDivElement>();

    React.useImperativeHandle(ref, () => toggleContainer.current, [toggleContainer.current]);

    React.useEffect(() => {
        window.document.addEventListener('click', handleActive);

        if (props.autoFocus && !props.disableSearch) {
            handleFocus();
        };

        return () => window.document.removeEventListener('click', handleActive);
    }, []);

    const handleFocus = (e?: React.FocusEvent<HTMLInputElement>) => {
        props.onFocus?.(e);
        setInFocus(true);
        toggleContainer.current.querySelector('input')?.focus();
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onBlur?.(e);
        setInFocus(false);
        toggleContainer.current.querySelector('input')?.blur();

        const isPickerChildTriggerBlur = isChildFocusable(e) || closest((e.relatedTarget as HTMLElement), toggleContainer.current);
        const shouldCloseOnBlur = props.isOpen && props.searchPosition !== 'body' && !isPickerChildTriggerBlur;

        if (shouldCloseOnBlur) {
            props.toggleDropdownOpening(false);
        }
    }

    const handleActive = (e: Event) => {
        if (closest((e.target as HTMLElement), toggleContainer.current)) {
           setIsActive(true);
        }

        if (isActive && !closest((e.target as HTMLElement), toggleContainer.current)) {
            setIsActive(false);
        }
    }

    const handleCrossIconClick = (e: React.SyntheticEvent<HTMLElement>) => {
        if (props.onClear) {
            props.onClear();
            props.onValueChange('');
        }
        e.stopPropagation();
    }

    const renderItems = () => {
        const maxItems = (props.maxItems || props.maxItems === 0) ? props.maxItems : 100;

        if (props.selection?.length > maxItems) {
            return props.renderItem?.({
                value: i18n.pickerToggler.createItemValue(props.selection.length, props.entityName || ''),
                onCheck: () => props.onClear?.(),
            } as any);
        } else {
            return props.selection?.map(row => props.renderItem?.(row));
        }
    }

    const renderInput = () => {
        const isActivePlaceholder = props.pickerMode === 'single' && props.selection && !!props.selection[0];
        const placeholder = isActivePlaceholder ? props.getName(props.selection[0]) : props.placeholder;
        const value = props.disableSearch ? null : props.value;

        if (props.disableSearch && props.pickerMode === 'multi' && props.selection.length > 0) {
            return null;
        }

        return <input
            type='text'
            tabIndex={ -1 }
            aria-haspopup={ true }
            autoComplete='no'
            aria-required={ props.isRequired }
            aria-disabled={ props.isDisabled }
            aria-readonly={ props.isReadonly }
            className={ cx(
                uuiElement.input,
                props.pickerMode === 'single' && css.singleInput,
                isActivePlaceholder && (!inFocus || props.isReadonly) && uuiElement.placeholder)
            }
            disabled={ props.isDisabled }
            placeholder={ placeholder }
            value={ value || '' }
            readOnly={ props.isReadonly || props.disableSearch }
            onChange={ e => props.onValueChange?.(e.target.value) }
        />;
    }

    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLInputElement>) => {
        if (props.isDisabled || props.isReadonly) return;
        e.preventDefault();
        if (inFocus && props.value && !props.disableSearch) return;
        props.onClick?.();
    }

    const icon = props.icon && <IconContainer icon={ props.icon } onClick={ props.onIconClick } />;

    return (
        <div
            onClick={ togglerPickerOpened }
            ref={ toggleContainer }
            className={ cx(css.container,
                uuiElement.inputBox,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                props.isInvalid && uuiMod.invalid,
                (!props.isReadonly && !props.isDisabled && props.onClick) && uuiMarkers.clickable,
                (!props.isReadonly && !props.isDisabled && inFocus) && uuiMod.focus,
                (!props.isReadonly && !props.isDisabled && isActive) && uuiMod.active,
                props.cx,
            ) }
            tabIndex={ inFocus ? -1 : 0 }
            onFocus={ handleFocus }
            onBlur={ handleBlur }
            onKeyDown={ props.onKeyDown }
            { ...props.rawProps }
        >
            <div className={ cx(css.body, !props.isSingleLine && props.pickerMode !== 'single' && css.multiline) }>
                { props.iconPosition !== 'right' && icon }
                { props.pickerMode !== 'single' && renderItems() }
                { renderInput() }
                { props.iconPosition === 'right' && icon }
            </div>
            <div className={ cx(css.actions) }>
                { !props.disableClear && (props.value || props.selection && props.selection.length > 0) && (
                    <IconContainer
                        cx={ cx('uui-icon-cancel', uuiMarkers.clickable) }
                        isDisabled={ props.isDisabled }
                        icon={ props.cancelIcon }
                        tabIndex={ -1 }
                        onClick={ handleCrossIconClick }
                    />
                ) }
                { props.isDropdown && (
                    <IconContainer
                        icon={ props.dropdownIcon }
                        flipY={ props.isOpen }
                        cx='uui-icon-dropdown'
                    />
                ) }
            </div>
        </div>
    );
};

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as <TItem, TId>(props: PickerTogglerProps<TItem, TId>, ref: React.ForwardedRef<HTMLElement>) => JSX.Element;
