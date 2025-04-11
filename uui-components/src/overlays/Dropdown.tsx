import React, { useCallback, useEffect, useLayoutEffect, useMemo, useContext, useState, forwardRef, useRef } from 'react';
import {
    useFloating, autoUpdate, flip, shift, useMergeRefs, hide, arrow,
} from '@floating-ui/react';
import { FreeFocusInside } from 'react-focus-lock';
import { isEventTargetInsideClickable, UuiContext } from '@epam/uui-core';
import type { LayoutLayer, DropdownProps } from '@epam/uui-core';
import { getFallbackPlacements } from '../helpers';
import { Portal } from './Portal';
import { isInteractedOutsideDropdown } from './DropdownHelpers';

function DropdownComponent(props: DropdownProps, ref: React.ForwardedRef<HTMLElement>) {
    const {
        value: controlledOpen,
        onValueChange: setControlledOpen,
        isNotUnfoldable,
        openOnHover,
        openOnClick,
        closeOnMouseLeave,
        closeOnClickOutside,
        closeOnTargetClick,
        openDelay,
        closeDelay,
        onClose,
        virtualTarget,
        renderTarget,
        renderBody,
        closeBodyOnTogglerHidden,
        zIndex,
        portalTarget,
        placement = 'bottom-start',
        middleware,
        boundaryElement,
    } = props;

    const uuiContext = useContext(UuiContext);

    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;

    const targetNodeRef = useRef<HTMLElement | null>(null);
    const bodyNodeRef = useRef<HTMLElement | null>(null);
    const arrowRef = useRef<HTMLDivElement | null>(null);
    const lastOpenedMsRef = useRef<number>(0);
    const togglerWidthRef = useRef<number>(0);
    const togglerHeightRef = useRef<number>(0);
    const layerRef = useRef<LayoutLayer | null>(null);
    const openDropdownTimerIdRef = useRef<NodeJS.Timeout | null>(null);
    const closeDropdownTimerIdRef = useRef<NodeJS.Timeout | null>(null);

    const isOpened = useCallback(() => {
        return open;
    }, [open]);

    const handleOpenedChange = useCallback((newOpened: boolean) => {
        setOpen(newOpened);

        if (newOpened) {
            lastOpenedMsRef.current = new Date().getTime();
        }
    }, [setOpen]);

    const defaultMiddleware = [
        flip({ fallbackPlacements: getFallbackPlacements(placement) }),
        shift({ boundary: boundaryElement, rootBoundary: 'viewport' }),
        hide(),
    ];

    if (arrowRef.current) {
        defaultMiddleware.push(arrow({ element: arrowRef }));
    }

    const { x, y, refs, strategy, placement: finalPlacement, middlewareData, update, isPositioned } = useFloating({
        middleware: defaultMiddleware.concat(middleware || []),
        placement: placement,
        strategy: 'fixed',
        open,
        onOpenChange: handleOpenedChange,
        whileElementsMounted: autoUpdate,
    });

    // Force update when the virtualTarget changes.
    useEffect(() => {
        update();
    }, [virtualTarget, update]);

    const clearOpenDropdownTimer = () => {
        if (openDropdownTimerIdRef.current) {
            clearTimeout(openDropdownTimerIdRef.current);
            openDropdownTimerIdRef.current = null;
        }
    };

    const clearCloseDropdownTimer = () => {
        if (closeDropdownTimerIdRef.current) {
            clearTimeout(closeDropdownTimerIdRef.current);
            closeDropdownTimerIdRef.current = null;
        }
    };

    const setOpenDropdownTimer = () => {
        openDropdownTimerIdRef.current = setTimeout(() => {
            // Use requestAnimationFrame to batch state updates
            requestAnimationFrame(() => {
                handleOpenedChange(true);
                clearOpenDropdownTimer();
            });
        }, openDelay || 0);
    };

    const setCloseDropdownTimer = (delay: number) => {
        closeDropdownTimerIdRef.current = setTimeout(() => {
            // Use requestAnimationFrame to batch state updates
            requestAnimationFrame(() => {
                handleOpenedChange(false);
                clearCloseDropdownTimer();
            });
        }, delay);
    };

    const handleMouseEnter = () => {
        clearCloseDropdownTimer();
        if (openDelay) {
            setOpenDropdownTimer();
        } else {
            handleOpenedChange(true);
        }
    };

    const handleMouseLeave = () => {
        clearOpenDropdownTimer();

        if (closeOnMouseLeave !== 'boundary') {
            // For boundary mode we have separate logic on onMouseMove handler
            if (closeDelay) {
                open && setCloseDropdownTimer(closeDelay);
            } else {
                handleOpenedChange(false);
            }
        }
    };

    const isClientInArea = (e: MouseEvent) => {
        const areaPadding = 30;
        const rect = bodyNodeRef.current?.getBoundingClientRect();

        if (rect) {
            const { height, width } = rect;

            if (rect.y && rect.x && width && height) {
                return rect.x - areaPadding <= e.clientX && e.clientX <= rect.x + areaPadding + width
                    && rect.y - areaPadding <= e.clientY && e.clientY <= rect.y + height + areaPadding;
            }
        }

        return false;
    };

    const getIsInteractedOutside = (event: Event) => {
        return isInteractedOutsideDropdown(
            event,
            [
                bodyNodeRef.current,
                targetNodeRef.current,
            ],
        );
    };

    const isInteractedOutside = (e: Event) => {
        if (!isOpened()) return false;
        return getIsInteractedOutside(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!bodyNodeRef.current || !targetNodeRef.current) return;

        if (isInteractedOutside(e) && isClientInArea(e) && !closeDropdownTimerIdRef.current) {
            // User cursor in boundary area, but not inside toggler or body
            clearOpenDropdownTimer();
            setCloseDropdownTimer(closeDelay ?? 1500);
        } else if (isInteractedOutside(e) && !isClientInArea(e)) {
            // User leave boundary area, close dropdown immediately or with closeDelay
            if (closeDelay && !closeDropdownTimerIdRef.current) {
                isOpened() && setCloseDropdownTimer(closeDelay);
            } else if (!closeDelay) {
                clearCloseDropdownTimer();
                handleOpenedChange(false);
            }
        } else if (!isInteractedOutside(e) && closeDropdownTimerIdRef.current) {
            // User returned to the toggler or body area, we need to clear close timer
            clearCloseDropdownTimer();
        }
    };

    const handleTargetClick = (e: React.SyntheticEvent<HTMLElement>) => {
        if (!isNotUnfoldable && !(e && isEventTargetInsideClickable(e))) {
            const currentValue = isOpened();
            const newValue = closeOnTargetClick === false ? true : !currentValue;

            if (currentValue !== newValue) {
                handleOpenedChange(newValue);
            }
        }
    };

    const getTargetClickHandler = useCallback(() => {
        if (openOnClick || !openOnHover) {
            return handleTargetClick;
        }
        return undefined;
    }, [openOnClick, openOnHover, handleTargetClick]);

    const onCloseHandler = useCallback(() => {
        if (onClose) onClose();
        else handleOpenedChange(false);
    }, [onClose, handleOpenedChange]);

    const clickOutsideHandler = (e: Event) => {
        if (isInteractedOutside(e)) {
            handleOpenedChange(false);
        }
    };

    // We'll use this function to get the reference element (either virtual or real)
    const getReferenceElement = () => {
        return virtualTarget || targetNodeRef.current;
    };

    // Modify this function to use the right reference element
    const updateTogglerSize = () => {
        const reference = getReferenceElement();
        if (reference) {
            const rect = reference.getBoundingClientRect();
            togglerWidthRef.current = rect.width;
            togglerHeightRef.current = rect.height;

            // Force update when toggler size changes
            if (virtualTarget) {
                update();
            }
        }
    };

    // Only use the real DOM ref if we're not using virtual references
    const mergedRefs = useMergeRefs([refs.setReference, targetNodeRef, ref]);
    const mergedTargetRef = virtualTarget
        ? (node: HTMLElement | null) => { targetNodeRef.current = node; }
        : mergedRefs;

    // Render target only if not using virtual reference
    const targetElement = !virtualTarget ? renderTarget({
        onClick: getTargetClickHandler(),
        isOpen: isOpened(),
        isDropdown: true,
        ref: mergedTargetRef,
        toggleDropdownOpening: handleOpenedChange,
        isInteractedOutside: getIsInteractedOutside,
    }) : null;

    // Set the reference element based on virtual or real element
    useEffect(() => {
        if (virtualTarget && refs.setPositionReference) {
            refs.setPositionReference(virtualTarget);
            // Force an initial update
            requestAnimationFrame(() => {
                update();
            });
        }
    }, [virtualTarget, refs.setPositionReference, update]);

    const body = useMemo(() => renderBody({
        onClose: onCloseHandler,
        togglerWidth: togglerWidthRef.current,
        togglerHeight: togglerHeightRef.current,
        scheduleUpdate: update,
        isOpen: isOpened(),
        arrowProps: {
            ref: arrowRef,
            style: middlewareData.arrow ? {
                top: middlewareData.arrow.y,
                left: middlewareData.arrow.x,
            } : {},
        },
        placement: finalPlacement,
    }), [
        renderBody,
        onCloseHandler,
        togglerWidthRef.current,
        togglerHeightRef.current,
        update,
        isOpened,
        middlewareData?.arrow?.y,
        middlewareData?.arrow?.x,
        finalPlacement,
    ]);

    const mergedBodyRef = useMergeRefs([refs.setFloating, bodyNodeRef]);

    useEffect(() => {
        if (open && closeOnMouseLeave === 'boundary') {
            window.addEventListener('mousemove', handleMouseMove);
        } else if (closeOnMouseLeave === 'boundary') {
            window.removeEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [open, closeOnMouseLeave, handleMouseMove]);

    useEffect(() => {
        layerRef.current = uuiContext.uuiLayout?.getLayer();

        window.addEventListener('dragstart', clickOutsideHandler);

        if (openOnHover && !openOnClick) {
            targetNodeRef.current?.addEventListener?.('mouseenter', handleMouseEnter);

            if (closeOnMouseLeave !== false) {
                targetNodeRef.current?.addEventListener?.('mouseleave', handleMouseLeave);
            }
        }

        if (closeOnClickOutside !== false) {
            window.addEventListener('click', clickOutsideHandler, true);
        }

        return () => {
            window.removeEventListener('dragstart', clickOutsideHandler);
            targetNodeRef.current?.removeEventListener?.('mouseenter', handleMouseEnter);
            targetNodeRef.current?.removeEventListener?.('mouseleave', handleMouseLeave);
            window.removeEventListener('click', clickOutsideHandler, true);
            layerRef.current && uuiContext.uuiLayout?.releaseLayer(layerRef.current);
        };
    }, [
        uuiContext.uuiLayout,
        openOnHover,
        openOnClick,
        closeOnMouseLeave,
        closeOnClickOutside,
        clickOutsideHandler,
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove,
    ]);

    useLayoutEffect(() => {
        if (isPositioned && middlewareData.hide?.referenceHidden && (closeBodyOnTogglerHidden !== false)) {
            handleOpenedChange(false);
        }
    }, [middlewareData.hide?.referenceHidden, closeBodyOnTogglerHidden, isPositioned, handleOpenedChange]);

    useEffect(() => {
        const reference = virtualTarget || targetNodeRef.current;
        // Only set up autoUpdate when both refs are present and dropdown is open
        if (open && reference && bodyNodeRef.current) {
            const cleanup = autoUpdate(
                reference,
                bodyNodeRef.current,
                update,
                {
                    ancestorScroll: (!virtualTarget && !!targetNodeRef.current?.isConnected && !!bodyNodeRef.current.isConnected),
                    ancestorResize: (!virtualTarget && !!targetNodeRef.current?.isConnected && !!bodyNodeRef.current.isConnected),
                    elementResize: (!virtualTarget && !!targetNodeRef.current?.isConnected && !!bodyNodeRef.current.isConnected),
                },
            );
            return cleanup;
        }
    }, [open, update, virtualTarget]);

    const shouldShowBody = open && !isNotUnfoldable;

    if (shouldShowBody) {
        updateTogglerSize();
    }

    return (
        <>
            {targetElement}
            {shouldShowBody && (
                <Portal target={ portalTarget }>
                    <FreeFocusInside>
                        <div
                            role="dialog"
                            className="uui-popper"
                            aria-hidden={ !isOpened() }
                            ref={ mergedBodyRef }
                            style={ {
                                position: strategy,
                                top: y ?? 0,
                                left: x ?? 0,
                                zIndex: zIndex != null ? zIndex : layerRef.current?.zIndex,
                            } }
                            data-placement={ finalPlacement }
                        >
                            {body}
                        </div>
                    </FreeFocusInside>
                </Portal>
            )}
        </>
    );
}

export const Dropdown = forwardRef(DropdownComponent);
