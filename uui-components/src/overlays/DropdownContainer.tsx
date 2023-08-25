import * as React from 'react';
import FocusLock from 'react-focus-lock';
import {
    uuiElement, IHasCX, IHasChildren, cx, IHasRawProps, uuiMarkers, IHasForwardedRef, IDropdownBodyProps,
} from '@epam/uui-core';
import { VPanel } from '../layout/flexItems/VPanel';
import PopoverArrow from './PopoverArrow';

type FocusLockProps = Pick<React.ComponentProps<typeof FocusLock>, 'returnFocus' | 'persistentFocus' | 'lockProps' | 'shards' | 'as' | 'className'>;
export interface DropdownContainerProps
    extends IHasCX,
    IHasChildren,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    IHasForwardedRef<HTMLDivElement>,
    IDropdownBodyProps,
    FocusLockProps {
    width?: number | 'auto';
    maxWidth?: number;
    /**
     * Wraps DropdownContainer with FocusLock component to support keyboard navigation. It's `true` by default.
     * After DropdownContainer appeared the focus will be set on the first focusable element inside.
     *
     * You can also specify the following props for FocusLock: 'returnFocus', 'persistentFocus', 'lockProps', 'shards', 'as', 'className' by passing them as DropdownContainer's props.
     * By default 'returnFocus' and 'persistentFocus' are true. It means that the focus is locked inside the component and the focus returns into initial position on unmount.
     */
    focusLock?: boolean;
    /**
     * If `true` it handles Escape key press on FocusLock wrappers (see `focusLock` prop) and calls `props.onClose()`.
     * By default the value is `true`.
     */
    closeOnEsc?: boolean;
    height?: number;
    showArrow?: boolean;
    style?: React.CSSProperties;
}

export const DropdownContainer = React.forwardRef((props: DropdownContainerProps, ref: any) => {
    function renderDropdownContainer() {
        return (
            <VPanel
                forwardedRef={ !focusLock && ref }
                cx={ cx(uuiElement.dropdownBody, !focusLock && cx(props.cx), uuiMarkers.lockFocus) }
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
        if (e.key === 'Escape' && props.isOpen) {
            props.onClose?.();
        }
    };

    // set default values if they're not specified
    const {
        focusLock = true,
        returnFocus = true,
        persistentFocus = true,
        closeOnEsc = true,
    } = props;

    return focusLock
        ? (
            <FocusLock
                ref={ ref }
                returnFocus={ returnFocus }
                persistentFocus={ persistentFocus }
                lockProps={ { ...(closeOnEsc && { onKeyDown: handleEscape }), ...props.lockProps } }
                className={ cx(props.cx) }
                shards={ props.shards }
                as={ props.as }
            >
                {renderDropdownContainer()}
            </FocusLock>
        )
        : renderDropdownContainer();
});
