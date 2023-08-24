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

class DropdownContainerInner extends React.Component<DropdownContainerProps> {
    render() {
        return (
            <VPanel
                forwardedRef={ this.props.forwardedRef }
                cx={ cx(uuiElement.dropdownBody, this.props.cx, uuiMarkers.lockFocus) }
                style={ {
                    ...this.props.style, minWidth: this.props.width, minHeight: this.props.height, maxWidth: this.props.maxWidth,
                } }
                rawProps={ { tabIndex: -1, ...this.props.rawProps } }
            >
                {this.props.children}
                {this.props.showArrow && (
                    <PopoverArrow ref={ this.props?.arrowProps?.ref } arrowProps={ this.props?.arrowProps } placement={ this.props?.placement || 'bottom-start' } />
                )}
            </VPanel>
        );
    }
}

export function DropdownContainer(props: DropdownContainerProps) {
    const handleEscape = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Escape' && props.isOpen) {
            props.onClose?.();
        }
    };

    const {
        focusLock,
        returnFocus,
        persistentFocus,
        closeOnEsc,
        lockProps,
        shards,
        as,
        className,
    } = props;

    const focusLockProps = {
        returnFocus,
        persistentFocus,
        lockProps: {
            ...(closeOnEsc && { onKeyDown: handleEscape }),
            ...lockProps,
        },
        ...(shards && { shards }),
        ...(as && { as }),
        className,
    };

    return focusLock
        ? (
            <FocusLock { ...focusLockProps } ref={ lockProps.lockRef }>
                <DropdownContainerInner { ...props }>{props.children}</DropdownContainerInner>
            </FocusLock>
        )
        : (<DropdownContainerInner { ...props }>{props.children}</DropdownContainerInner>);
}

DropdownContainer.defaultProps = {
    focusLock: true,
    closeOnEsc: true,
    returnFocus: true,
    persistentFocus: true,
};
