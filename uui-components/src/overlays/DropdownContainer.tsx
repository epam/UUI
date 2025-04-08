import * as React from 'react';
import FocusLock from 'react-focus-lock';
import {
    uuiElement, IHasCX, IHasChildren, cx, IHasRawProps, uuiMarkers, IHasForwardedRef, IDropdownBodyProps,
    IHasStyleAttrs,
} from '@epam/uui-core';
import { VPanel } from '../layout/flexItems/VPanel';
import PopoverArrow from './PopoverArrow';
import { ReactFocusLockProps } from 'react-focus-lock';

export interface DropdownContainerProps
    extends IHasCX,
    IHasChildren,
    IHasStyleAttrs,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    IHasForwardedRef<HTMLDivElement>,
    IDropdownBodyProps, Pick<ReactFocusLockProps, 'autoFocus' | 'as' | 'shards' | 'returnFocus'> {
    /** Defines width in 'px' or 'auto'. If 'auto' provided, will be used width of the content. */
    width?: number | 'auto';
    /** Defines maximum width in 'px'. If 'auto' provided, will be used width of the content. */
    maxWidth?: number | 'auto';
    /** Defines height in 'px'. */
    height?: number;
    /** Defines maxHeight in 'px'. If 'auto' provided, will be used height of the content. */
    maxHeight?: number | 'auto';
    /** If true, arrow tip will be shown
     * @default false
     * */
    showArrow?: boolean;
    /**
     * Pass true to wrap DropdownContainer with FocusLock component to support keyboard navigation.
     * If omitted, true value will be used.
     *
     * After DropdownContainer appeared the focus will be set on the first focusable element inside.
     * @default true
     */
    focusLock?: boolean;
    /**
     * Pass true to lock focus within DropdownContainer.
     * If omitted, true value will be used. It's used if focusLock=true.
     */
    persistentFocus?: boolean;
    /**
     * Pass any extra props to the FocusLock wrapper.
     */
    lockProps?: Record<string, any>;
    /**
     * Pass true to handle Escape key press and call props.onClose().
     * If omitted, true value will be used. It's used if focusLock=true.
     */
    closeOnEsc?: boolean;
    /** Called on keyDown event in DropdownContainer.
     Can be used to provide your own handlers.
     */
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
}

export const DropdownContainer = React.forwardRef((props: DropdownContainerProps, ref: React.ForwardedRef<HTMLElement>) => {
    const {
        focusLock = true,
        returnFocus = true,
        persistentFocus = true,
        closeOnEsc = true,
    } = props;

    function renderDropdownContainer() {
        return (
            <VPanel
                forwardedRef={ !focusLock ? ref as React.ForwardedRef<HTMLDivElement> : undefined }
                cx={ cx(uuiElement.dropdownBody, uuiMarkers.lockFocus, props.cx) }
                style={ {
                    ...props.style,
                    minWidth: props.width,
                    minHeight: props.height,
                    maxHeight: props.maxHeight,
                    maxWidth: props.maxWidth ?? props.width,
                } }
                rawProps={ { tabIndex: -1, ...props.rawProps } }
            >
                {props.children}
                {props.showArrow && (
                    <PopoverArrow ref={ props?.arrowProps?.ref } arrowProps={ props?.arrowProps } placement={ props?.placement || 'bottom-start' } />
                )}
            </VPanel>
        );
    }

    const handleEscape = (e: React.KeyboardEvent<HTMLElement>) => {
        props.onKeyDown?.(e);
        if (e.key === 'Escape' && closeOnEsc && props.isOpen) {
            e.preventDefault();
            props.onClose?.();
        }
    };

    return focusLock
        ? (
            <FocusLock
                ref={ ref }
                returnFocus={ typeof returnFocus === 'function' ? returnFocus : returnFocus && { preventScroll: true } }
                persistentFocus={ persistentFocus }
                lockProps={ { ...({ onKeyDown: handleEscape }), ...props.lockProps } }
                shards={ props.shards }
                autoFocus={ props.autoFocus || true }
                as={ props.as }
            >
                {renderDropdownContainer()}
            </FocusLock>
        )
        : renderDropdownContainer();
});
