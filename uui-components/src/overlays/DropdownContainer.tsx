import * as React from 'react';
import FocusLock from 'react-focus-lock';
import {
    uuiElement, IHasCX, IHasChildren, cx, IHasRawProps, uuiMarkers, IHasForwardedRef, IDropdownBodyProps,
} from '@epam/uui-core';
import { VPanel } from '../layout/flexItems/VPanel';
import PopoverArrow from './PopoverArrow';

export interface DropdownContainerProps
    extends IHasCX,
    IHasChildren,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    IHasForwardedRef<HTMLDivElement>,
    IDropdownBodyProps {
    width?: number | 'auto';
    maxWidth?: number;
    height?: number;
    showArrow?: boolean;
    style?: React.CSSProperties;
    /**
     * Pass true to wrap DropdownContainer with FocusLock component to support keyboard navigation.
     * If omitted, true value will be used.
     *
     * After DropdownContainer appeared the focus will be set on the first focusable element inside.
     * @default true
     */
    focusLock?: boolean;
    /**
     * Pass true to return focus into initial position on unmount.
     * If omitted, true value will be used. It's used if focusLock=true.
     * */
    returnFocus?: boolean;
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
     * Pass an array of ref pointing to the nodes, which focus lock should consider and a part of it. This is a way of focus scattering.
     */
    shards?: Array<React.RefObject<HTMLElement>>;
    /**
     * Pass element name if you need to change internal FocusLock div element, to any other.
     */
    as?: string;
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
                forwardedRef={ !focusLock && ref as React.ForwardedRef<HTMLDivElement> }
                cx={ cx(uuiElement.dropdownBody, uuiMarkers.lockFocus, props.cx) }
                style={ {
                    ...props.style, minWidth: props.width, minHeight: props.height, maxWidth: props.maxWidth,
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
                returnFocus={ returnFocus }
                persistentFocus={ persistentFocus }
                lockProps={ { ...({ onKeyDown: handleEscape }), ...props.lockProps } }
                shards={ props.shards }
                as={ props.as }
            >
                {renderDropdownContainer()}
            </FocusLock>
        )
        : renderDropdownContainer();
});
