import * as React from 'react';
import { IPickerToggler, IHasIcon, IHasCX, ICanBeReadonly, Icon, uuiMod, uuiElement, uuiMarkers, cx, IHasRawProps, ICanFocus, isEventTargetInsideClickable, DataRowProps, IHasCaption, IDisableable } from '@epam/uui-core';
import { IconContainer } from '../layout';
import css from './PickerToggler.module.scss';
import { i18n } from '../i18n';
import { getMaxItems } from './helpers';

export interface PickerTogglerRenderItemParams<TItem, TId> extends IHasCaption, IDisableable {
    /** Key for the component */
    key: string;
    /** DataRowProps object of the rendered item */
    rowProps?: DataRowProps<TItem, TId>;
    /** Indicates that tag is collapsed rest selected items, like '+N items selected' */
    isCollapsed?: boolean;
    /** Call to clear a value */
    onClear?(e?: any): void;
    /**
     * The array of rows that are folded in the 'collapsed button'
     * (only in selectionMode='multi' with maxItems property, in other ways it's an empty array)
     */
    collapsedRows?: DataRowProps<TItem, TId>[];
}

export interface PickerTogglerProps<TItem = any, TId = any>
    extends IPickerToggler<TItem, TId>, ICanFocus<HTMLElement>, IHasIcon, IHasCX, ICanBeReadonly, IHasRawProps<React.HTMLAttributes<HTMLElement>> {
    cancelIcon?: Icon;
    dropdownIcon?: Icon;
    autoFocus?: boolean;
    renderItem?(props: PickerTogglerRenderItemParams<TItem, TId>): React.ReactNode;
    getName?: (item: TItem) => string;
    entityName?: string;
    maxItems?: number;
    isSingleLine?: boolean;
    pickerMode: 'single' | 'multi';
    searchPosition: 'input' | 'body' | 'none';
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    closePickerBody(): void;
    disableSearch?: boolean;
    disableClear?: boolean;
    minCharsToSearch?: number;
    /**
    * HTML ID attribute for the toggler input
    */
    id?: string;
}

function PickerTogglerComponent<TItem, TId>(props: PickerTogglerProps<TItem, TId>, ref: React.ForwardedRef<HTMLElement>) {
    const [inFocus, setInFocus] = React.useState<boolean>(false);

    const toggleContainer = React.useRef<HTMLDivElement>();
    const inputContainer = React.useRef<HTMLInputElement>();

    React.useImperativeHandle(ref, () => toggleContainer.current, [toggleContainer.current]);

    const handleClick = React.useCallback(
        (event: Event) => {
            if (props.isInteractedOutside(event) && inFocus) {
                blur();
            }
        },
        [inFocus],
    );

    React.useEffect(() => {
        // We need to subscribe on any document clicks, when toggler is in focus to be able to make blur on toggler in case of click outside.
        inFocus && window.document.addEventListener('click', handleClick);

        if (props.autoFocus && !props.disableSearch) {
            inputContainer.current?.focus();
        }

        return () => window.document.removeEventListener('click', handleClick);
    }, [inFocus, handleClick]);

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
        props.closePickerBody();
        inputContainer.current?.blur();
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onFocus?.(e);
        setInFocus(true);
        props.searchPosition === 'input' && inputContainer.current?.focus();
    };

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        if (props.isOpen) {
            // If picker opened and search inside input, we lock focus on toggler.
            // In case, when search inside body, we need to highlight toggler like in focus state, even when focus was moved to the body. So we do nothing in this case.
            if (props.searchPosition === 'input') {
                inputContainer.current?.focus();
            }
        } else {
            // If picker closed, we perform blur event as usual.
            blur(e);
        }
    };

    const handleCrossIconClick = () => {
        if (props.onClear) {
            props.onClear();
            props.onValueChange('');
        }
        // When we click on the cross it disappears from the DOM and focus is passed to the Body. So in this case we have to return focus on the toggleContainer by hand.
        toggleContainer.current?.focus();
    };

    const renderItems = () => {
        const maxItems = getMaxItems(props.maxItems);
        const isPickerDisabled = props.isDisabled || props.isReadonly;
        let areAllDisabled = isPickerDisabled;
        const displayedRows = props.selectedRowsCount > maxItems ? props.selection.slice(0, maxItems) : props.selection;
        const collapsedRows = props.selection?.slice(maxItems);

        const tags = displayedRows?.map((row) => {
            if (!isPickerDisabled && !row.isDisabled) {
                areAllDisabled = false;
            }

            const tagProps = {
                key: row?.id as string,
                rowProps: row,
                caption: props.getName(row.value),
                isCollapsed: false,
                isDisabled: isPickerDisabled || row.isDisabled,
                onClear: () => {
                    row.onCheck?.(row);
                    // When we delete item it disappears from the DOM and focus is passed to the Body. So in this case we have to return focus on the toggleContainer by hand.
                    toggleContainer.current?.focus();
                },
            };

            return props.renderItem?.(tagProps);
        });

        if (props.selectedRowsCount > maxItems) {
            const collapsedTagProps = props.renderItem?.({
                key: 'collapsed',
                caption: i18n.pickerToggler.createItemValue(props.selectedRowsCount - maxItems, ''),
                isCollapsed: true,
                isDisabled: areAllDisabled,
                onClear: null,
                collapsedRows,
            } as any);
            tags.push(collapsedTagProps);
        }

        return tags;
    };

    const renderInput = () => {
        const isSinglePickerSelected = props.pickerMode === 'single' && props.selection && !!props.selection[0];
        let placeholder: string;
        if (!isSinglePickerSelected) {
            placeholder = props.placeholder;
        }

        if (isSinglePickerSelected) {
            placeholder = props.selection[0].isLoading ? undefined : props.getName(props.selection[0]?.value);
        }
        const value = props.disableSearch ? null : props.value;
        if (props.searchPosition !== 'input' && props.pickerMode === 'multi' && props.selectedRowsCount > 0) {
            return null;
        }

        return (
            <input
                id={ props?.id }
                type="text"
                tabIndex={ -1 }
                ref={ inputContainer }
                aria-haspopup={ true }
                autoComplete="no"
                aria-required={ props.isRequired }
                aria-disabled={ props.isDisabled }
                aria-readonly={ props.isReadonly }
                className={ cx(
                    uuiElement.input,
                    props.pickerMode === 'single' && css.singleInput,
                    props.searchPosition === 'input' && css.cursorText,
                    isActivePlaceholder() && uuiElement.placeholder,
                ) }
                disabled={ props.isDisabled }
                placeholder={ placeholder }
                value={ value || '' }
                readOnly={ props.isReadonly || props.disableSearch }
                onChange={ (e) => props.onValueChange?.(e.target.value) }
            />
        );
    };

    const shouldToggleBody = (e: React.MouseEvent<HTMLDivElement>): boolean => {
        const isInteractionDisabled = (props.isDisabled || props.isReadonly || isEventTargetInsideClickable(e));
        const shouldOpenWithMinCharsToSearch = (inFocus && props.value && props.minCharsToSearch);
        const isPickerOpenWithSearchInInput = (props.isOpen && props.searchPosition === 'input' && (e.target as HTMLInputElement).tagName === 'INPUT');
        return !(isInteractionDisabled || shouldOpenWithMinCharsToSearch || isPickerOpenWithSearchInInput);
    };

    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!shouldToggleBody(e)) return;
        toggleContainer.current.focus();
        props.onClick?.();
    };

    const icon = props.icon && (
        <IconContainer
            icon={ props.icon }
            onClick={ props.onIconClick }
        />
    );

    return (
        <div
            onClick={ togglerPickerOpened }
            ref={ toggleContainer }
            className={ cx(
                css.container,
                uuiElement.inputBox,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                props.isInvalid && uuiMod.invalid,
                !props.isReadonly && !props.isDisabled && props.onClick && uuiMarkers.clickable,
                !props.isReadonly && !props.isDisabled && inFocus && uuiMod.focus,
                props.cx,
            ) }
            tabIndex={ inFocus || props.isReadonly || props.isDisabled ? -1 : 0 }
            onFocus={ handleFocus }
            onBlur={ handleBlur }
            onKeyDown={ props.onKeyDown }
            { ...props.rawProps }
        >
            <div className={ cx(css.body, !props.isSingleLine && props.pickerMode !== 'single' && 'uui-multiline') }>
                {props.iconPosition !== 'right' && icon}
                {props.pickerMode !== 'single' && renderItems()}
                {renderInput()}
                {props.iconPosition === 'right' && icon}
            </div>
            {!props.isDisabled && !props.isReadonly && (
                <div className="uui-actions">
                    {!props.disableClear && (props.value || props.selectedRowsCount > 0) && (
                        <IconContainer
                            cx={ cx('uui-icon-cancel', uuiMarkers.clickable) }
                            isDisabled={ props.isDisabled }
                            icon={ props.cancelIcon }
                            tabIndex={ -1 }
                            onClick={ handleCrossIconClick }
                            rawProps={ { role: 'button', 'aria-label': 'Clear' } }
                        />
                    )}
                    {props.isDropdown && !props?.minCharsToSearch && <IconContainer icon={ props.dropdownIcon } flipY={ props.isOpen } cx="uui-icon-dropdown" />}
                </div>
            )}
        </div>
    );
}

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as <TItem, TId>(
    props: PickerTogglerProps<TItem, TId>,
    ref: React.ForwardedRef<HTMLElement>
) => JSX.Element;
