import * as React from 'react';
import { IPickerToggler, IHasIcon, IHasCX, ICanBeReadonly, Icon, uuiMod, uuiElement, uuiMarkers, cx, IHasRawProps, ICanFocus, isEventTargetInsideClickable, DataRowProps, IHasCaption, IDisableable } from '@epam/uui-core';
import { IconContainer } from '../layout';
import { i18n } from '../i18n';
import css from './PickerToggler.module.scss';
import { browserBugFixDirAuto } from '../helpers/browserBugFixDirAuto';
import { IconButton } from '../buttons/IconButton';
import { flushSync } from 'react-dom';

export interface PickerTogglerRenderItemParams<TItem, TId> extends IHasCaption, IDisableable {
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

function PickerTogglerComponent<TItem, TId>(props: PickerTogglerProps<TItem, TId>, ref: React.ForwardedRef<HTMLDivElement>) {
    const [inFocus, setInFocus] = React.useState<boolean>(false);

    const searchInput = React.useRef<HTMLInputElement>(undefined);
    const containerRef = React.useRef<HTMLDivElement>(undefined);

    React.useImperativeHandle(ref, () => containerRef.current, [containerRef.current]);

    const isSearchInToggler = props.searchPosition === 'input';
    const isPickerDisabled = props.isDisabled || props.isReadonly;

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

        if (props.autoFocus && !props.disableSearch && isSearchInToggler) {
            searchInput.current?.focus();
        }

        return () => window.document.removeEventListener('click', handleClick);
    }, [inFocus, handleClick]);

    const isActivePlaceholder = (): Boolean => {
        if (props.pickerMode === 'single' && !isSearchInToggler && props.selection?.length > 0) {
            return true;
        }
        return false;
    };

    const blur = (e?: React.FocusEvent<HTMLElement>) => {
        setInFocus(false);
        props.onBlur?.(e);
        props.closePickerBody();
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onFocus?.(e);
        setInFocus(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        /*
            Handles the case when focus is moved from the input
            to the picker body when it opens any any interactions happen there.
            It is necessary to exit because otherwise `isFocus` will be set to `true`
            (which will trigger `handleClick`) and would close the picker body.
        */
        if (props.isOpen) {
            return;
        }

        blur(e);
    };

    const getFocusableControl = (): HTMLElement | undefined => {
        if (searchInput.current) {
            return searchInput.current;
        }

        return containerRef.current;
    };

    const moveFocusToControl = () => {
        const focusableControl = getFocusableControl();

        focusableControl?.focus();

        setInFocus(true);
    };

    const handleCrossIconClick = () => {
        if (props.onClear) {
            /*
                `flushSync` is necessary for case when the input was hidden, and after the action is appears again.
                In this case, `moveFocusToControl` should pick it instead of the container.
            */
            flushSync(() => {
                props.onClear();
                props.onValueChange('');
            });
        }
        // When we click on the cross it disappears from the DOM and focus is passed to the Body. So in this case we have to return focus on the control by hand.
        moveFocusToControl();
    };

    const renderItems = () => {
        let areAllDisabled = isPickerDisabled;
        const displayedRows = props.selectedRowsCount > props.maxItems ? props.selection.slice(0, props.maxItems) : props.selection;
        const collapsedRows = props.selection?.slice(props.maxItems);

        const tags = displayedRows?.map((row) => {
            if (!isPickerDisabled && !row.isDisabled) {
                areAllDisabled = false;
            }

            const tagProps = {
                rowProps: row,
                caption: row.isLoading ? null : props.getName(row.value),
                isCollapsed: false,
                isDisabled: isPickerDisabled || row.isDisabled,
                onClear: () => {
                    /*
                        `flushSync` is necessary for case when the input was hidden, and after the action is appears again.
                        In this case, `moveFocusToControl` should pick it instead of the container.
                    */
                    flushSync(() => {
                        row.onCheck?.(row);
                    });
                    // When we delete item it disappears from the DOM and focus is passed to the Body. So in this case we have to return focus on the control by hand.
                    moveFocusToControl();
                },
            };

            return props.renderItem?.(tagProps);
        });

        if (props.selectedRowsCount > props.maxItems) {
            const collapsedTagProps = props.renderItem?.({
                caption: props.maxItems > 0
                    ? `+ ${props.selectedRowsCount - props.maxItems}`
                    : i18n.pickerToggler.collapsedItemsTagName(props.selectedRowsCount),
                isCollapsed: true,
                isDisabled: areAllDisabled,
                onClear: null,
                collapsedRows,
            } as any);
            tags.push(collapsedTagProps);
        }

        return tags;
    };

    const shouldToggleBody = (e: React.MouseEvent<HTMLDivElement>): boolean => {
        const isInteractionDisabled = isPickerDisabled || isEventTargetInsideClickable(e);
        const shouldOpenWithMinCharsToSearch = (inFocus && props.value && (props.minCharsToSearch && props.searchPosition === 'input'));
        const isPickerOpenWithSearchInInput = (props.isOpen && props.searchPosition === 'input' && (e.target as HTMLInputElement).tagName === 'INPUT');
        return !(isInteractionDisabled || shouldOpenWithMinCharsToSearch || isPickerOpenWithSearchInInput);
    };

    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!shouldToggleBody(e)) return;
        props.onClick?.();
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

        if (!isSearchInToggler && props.pickerMode === 'multi' && props.selectedRowsCount > 0) {
            searchInput.current = undefined;

            return null;
        }

        return (
            <input
                id={ props?.id }
                type="search"
                tabIndex={ isPickerDisabled || !isSearchInToggler ? -1 : 0 } // If search not in toggler, we shouldn't make this input focusable
                ref={ searchInput }
                aria-haspopup={ true }
                autoComplete="no"
                aria-required={ props.isRequired }
                aria-disabled={ props.isDisabled }
                aria-readonly={ props.isReadonly }
                onFocus={ handleFocus }
                onBlur={ handleBlur }
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
                onKeyDown={ props.onKeyDown }
                dir={ browserBugFixDirAuto(value || placeholder) } // TODO: remove after browser bug fix
                onClick={ togglerPickerOpened }
            />
        );
    };

    const getIcon = (): React.ReactNode => {
        if (!props.icon) {
            return null;
        }

        if (
            !props.onIconClick
            || isPickerDisabled
        ) {
            return (
                <IconContainer
                    icon={ props.icon }
                />
            );
        }

        return (
            <IconButton
                icon={ props.icon }
                onClick={ props.onIconClick }
                cx={ css.clickableIcon }
                rawProps={ {
                    'aria-label': 'Icon in input',
                } }
            />
        );
    };

    const icon = getIcon();

    const getIsEventTargetContainer = (event: React.SyntheticEvent) : boolean => {
        const eventTargetElement = event.target as HTMLElement;

        return eventTargetElement === containerRef.current;
    };

    const getIsNonClickableEventTarget = (event: React.SyntheticEvent): boolean => {
        const eventTargetElement = event.target as HTMLElement;
        const isWithingContainer = containerRef.current?.contains(eventTargetElement);
        const isClickable = eventTargetElement.classList.contains(uuiMarkers.clickable);

        return (
            (
                isWithingContainer
                && !isClickable
            )
            || getIsEventTargetContainer(event)
        );
    };

    const getIsFocusableControlContainer = (): boolean => {
        return containerRef.current === getFocusableControl();
    };

    const handleWrapperClick = (event: React.MouseEvent<HTMLElement>) => {
        if (isPickerDisabled) {
            return;
        }

        if (getIsNonClickableEventTarget(event)) {
            moveFocusToControl();

            if (
                getIsFocusableControlContainer()
                && getIsFocusableControlContainer()
            ) {
                props.onClick?.(event);
            }
        }
    };

    const handleWrapperFocus = (event: React.FocusEvent<HTMLElement>) => {
        if (isPickerDisabled) {
            return;
        }

        if (getIsNonClickableEventTarget(event)) {
            moveFocusToControl();

            if (getIsEventTargetContainer(event)) {
                props.onFocus?.(event);
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (isPickerDisabled) {
            return;
        }

        if (
            getIsNonClickableEventTarget(event)
            && getIsFocusableControlContainer()
        ) {
            props.onKeyDown?.(event);
        }
    };

    return (
        <div
            ref={ containerRef }
            className={ cx(
                css.container,
                uuiElement.inputBox,
                props.isDisabled && uuiMod.disabled,
                props.isReadonly && uuiMod.readonly,
                props.isInvalid && uuiMod.invalid,
                !props.isReadonly && !props.isDisabled && inFocus && uuiMod.focus,
                props.selection?.length > 0 && uuiMarkers.hasValue,
                props.cx,
            ) }
            onClick={ handleWrapperClick }
            onFocus={ handleWrapperFocus }
            onBlur={ handleBlur }
            onKeyDown={ handleKeyDown }
            // If search in toggler, we make nested search input focusable, and wrapper not.
            // It's required that only 1 focusable element in toggler, since if we have more we will go through all of them using tab key
            tabIndex={ isPickerDisabled || isSearchInToggler ? undefined : 0 }
            { ...props.rawProps }
        >
            <div className={ cx(css.body, !props.isSingleLine && props.pickerMode !== 'single' && 'uui-picker_toggler-multiline') }>
                {props.iconPosition !== 'right' && icon}
                {props.pickerMode !== 'single' && renderItems()}
                {renderInput()}
                {props.iconPosition === 'right' && icon}
            </div>
            {!isPickerDisabled && (
                <div className="uui-picker_toggler-actions">
                    {!props.disableClear && (props.value || props.selectedRowsCount > 0) && (
                        <IconButton
                            cx="uui-icon-cancel"
                            isDisabled={ props.isDisabled }
                            icon={ props.cancelIcon }
                            onClick={ handleCrossIconClick }
                            rawProps={ {
                                'aria-label': 'Clear input',
                            } }
                        />
                    )}
                    {props.isDropdown
                        && (!props?.minCharsToSearch || (props?.minCharsToSearch && props.searchPosition === 'body'))
                        && <IconContainer icon={ props.dropdownIcon } flipY={ props.isOpen } cx="uui-icon-dropdown" />}
                </div>
            )}
        </div>
    );
}

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as <TItem, TId>(props: PickerTogglerProps<TItem, TId>) => ReturnType<typeof PickerTogglerComponent>;
