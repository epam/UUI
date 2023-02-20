import * as React from 'react';
import {
    IPickerToggler,
    IHasIcon,
    IHasCX,
    ICanBeReadonly,
    Icon,
    uuiMod,
    uuiElement,
    uuiMarkers,
    DataRowProps,
    cx,
    IHasRawProps,
    ICanFocus,
} from '@epam/uui-core';
import { IconContainer } from '../layout';
import css from './PickerToggler.scss';
import { i18n } from '../i18n';
import { useCallback } from 'react';

export interface PickerTogglerProps<TItem = any, TId = any>
    extends IPickerToggler<TItem, TId>,
        ICanFocus<HTMLElement>,
        IHasIcon,
        IHasCX,
        ICanBeReadonly,
        IHasRawProps<React.HTMLAttributes<HTMLElement>> {
    cancelIcon?: Icon;
    dropdownIcon?: Icon;
    autoFocus?: boolean;
    renderItem?(props: DataRowProps<TItem, TId>): React.ReactNode;
    getName?: (item: TItem) => string;
    entityName?: string;
    maxItems?: number;
    isSingleLine?: boolean;
    pickerMode: 'single' | 'multi';
    searchPosition: 'input' | 'body' | 'none';
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    disableSearch?: boolean;
    disableClear?: boolean;
    minCharsToSearch?: number;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
}

function PickerTogglerComponent<TItem, TId>(props: PickerTogglerProps<TItem, TId>, ref: React.ForwardedRef<HTMLElement>) {
    const [inFocus, setInFocus] = React.useState<boolean>(false);

    const toggleContainer = React.useRef<HTMLDivElement>();
    const inputContainer = React.useRef<HTMLInputElement>();

    React.useImperativeHandle(ref, () => toggleContainer.current, [toggleContainer.current]);

    const handleClick = useCallback(
        (event: Event) => {
            if (props.isInteractedOutside(event) && inFocus) {
                blur();
            }
        },
        [inFocus]
    );

    React.useEffect(() => {
        props.isOpen && window.document.addEventListener('click', handleClick);

        if (props.autoFocus && !props.disableSearch) {
            inputContainer.current?.focus();
        }

        return () => !props.isOpen && window.document.removeEventListener('click', handleClick);
    }, [props.isOpen]);

    const isActivePlaceholder = (): Boolean => {
        if (props.isReadonly) return false;
        else if (props.isOpen && props.searchPosition === 'input') return false;
        else if (props.minCharsToSearch && inFocus) return false;
        else if (props.pickerMode === 'single' && props.selection && props.selection.length > 0) return true;
        else return false;
    };

    const blur = (e?: React.FocusEvent<HTMLElement>) => {
        setInFocus(false);
        props.onBlur?.(e);
        inputContainer.current?.blur();
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onFocus?.(e);
        setInFocus(true);
        inputContainer.current?.focus();
    };

    const handleBlur = () => !props.isOpen && blur();

    const handleCrossIconClick = (e: React.SyntheticEvent<HTMLElement>) => {
        if (props.onClear) {
            props.onClear();
            props.onValueChange('');
        }
        e.stopPropagation();
    };

    const renderItems = () => {
        const maxItems = props.maxItems || props.maxItems === 0 ? props.maxItems : 100;

        if (props.selection?.length > maxItems) {
            return props.renderItem?.({
                value: i18n.pickerToggler.createItemValue(props.selection.length, props.entityName || ''),
                onCheck: () => props.onClear?.(),
            } as any);
        } else {
            return props.selection?.map(row => props.renderItem?.(row));
        }
    };

    const renderInput = () => {
        const isSinglePickerSelected = props.pickerMode === 'single' && props.selection && !!props.selection[0];
        const placeholder = isSinglePickerSelected ? props.getName(props.selection[0]?.value) : props.placeholder;
        const value = props.disableSearch ? null : props.value;
        if (props.searchPosition !== 'input' && props.pickerMode === 'multi' && props.selection.length > 0) {
            return null;
        }

        return (
            <input
                type="text"
                tabIndex={-1}
                ref={inputContainer}
                aria-haspopup={true}
                autoComplete="no"
                aria-required={props.isRequired}
                aria-disabled={props.isDisabled}
                aria-readonly={props.isReadonly}
                className={cx(
                    uuiElement.input,
                    props.pickerMode === 'single' && css.singleInput,
                    props.searchPosition === 'input' && css.cursorText,
                    isActivePlaceholder() && uuiElement.placeholder
                )}
                disabled={props.isDisabled}
                placeholder={placeholder}
                value={value || ''}
                readOnly={props.isReadonly || props.disableSearch}
                onChange={e => props.onValueChange?.(e.target.value)}
            />
        );
    };

    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.isDisabled || props.isReadonly) return;
        e.preventDefault();
        if (inFocus && props.value && !props.disableSearch) return;
        props.onClick?.();
    };

    const icon = props.icon && <IconContainer icon={props.icon} onClick={props.onIconClick} />;

    return (
        <div
            onClick={togglerPickerOpened}
            ref={toggleContainer}
            className={cx(
                css.container,
                uuiElement.inputBox,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                props.isInvalid && uuiMod.invalid,
                !props.isReadonly && !props.isDisabled && props.onClick && uuiMarkers.clickable,
                !props.isReadonly && !props.isDisabled && inFocus && uuiMod.focus,
                props.cx
            )}
            tabIndex={inFocus || props.isReadonly || props.isDisabled ? -1 : 0}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={props.onKeyDown}
            {...props.rawProps}
        >
            {props.prefix && <span className={uuiElement.prefixInput}>{props.prefix}</span>}
            <div className={cx(css.body, !props.isSingleLine && props.pickerMode !== 'single' && css.multiline)}>
                {props.iconPosition !== 'right' && icon}
                {props.pickerMode !== 'single' && renderItems()}
                {renderInput()}
                {props.iconPosition === 'right' && icon}
            </div>
            {!props.isDisabled && !props.isReadonly && (
                <div className={css.actions}>
                    {!props.disableClear && (props.value || (props.selection && props.selection.length > 0)) && (
                        <IconContainer
                            cx={cx('uui-icon-cancel', uuiMarkers.clickable)}
                            isDisabled={props.isDisabled}
                            icon={props.cancelIcon}
                            tabIndex={-1}
                            onClick={handleCrossIconClick}
                        />
                    )}
                    {props.isDropdown && <IconContainer icon={props.dropdownIcon} flipY={props.isOpen} cx="uui-icon-dropdown" />}
                </div>
            )}
            {props.suffix && <span className={uuiElement.suffixInput}>{props.suffix}</span>}
        </div>
    );
}

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as <TItem, TId>(
    props: PickerTogglerProps<TItem, TId>,
    ref: React.ForwardedRef<HTMLElement>
) => JSX.Element;
