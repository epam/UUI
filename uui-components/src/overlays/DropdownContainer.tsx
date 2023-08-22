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
    focusLock?: React.ComponentProps<typeof FocusLock> | boolean;
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
                rawProps={ { tabIndex: this.props.focusLock ? -1 : 0, ...this.props.rawProps } }
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
            props.onClose();
        }
    };

    const getFocusLockProps = () => {
        const { focusLock } = props;
        const defaultProps = {
            returnFocus: true,
            persistentFocus: true,
            lockProps: { onKeyDown: handleEscape },
        };

        if (focusLock === true) {
            return defaultProps;
        }
        if (typeof focusLock === 'object') {
            return {
                ...defaultProps,
                ...(focusLock as typeof FocusLock),
            };
        }
    };

    return props.focusLock
        ? (
            <FocusLock { ...getFocusLockProps() }>
                <DropdownContainerInner { ...props }>{props.children}</DropdownContainerInner>
            </FocusLock>
        )
        : (<DropdownContainerInner { ...props }>{props.children}</DropdownContainerInner>);
}
