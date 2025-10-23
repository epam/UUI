import * as React from 'react';
import { uuiElement, uuiMarkers } from '../constants';

export function isEventTargetInsideClickable(e: React.SyntheticEvent<Element>): boolean {
    return isAnyParentHasClass(_getEventTarget(e), e.currentTarget, [uuiMarkers.clickable]);
}

export function isEventTargetInsideDraggable(e: React.PointerEvent, toElement: Node) {
    return isAnyParentHasClass(_getEventTarget(e), toElement, [uuiMarkers.draggable]);
}

export function isEventTargetInsideInput(e: Event | React.PointerEvent, toElement: Node) {
    return isAnyParentHasClass(_getEventTarget(e), toElement, [uuiElement.input]);
}

export function releasePointerCaptureOnEventTarget(e: React.PointerEvent) {
    (_getEventTarget(e) as HTMLElement).releasePointerCapture(e.pointerId);
}

/**
 * Iterates parent elements starting from "fromElement" and goes through its parents until "toElement" is found.
 * It returns true if any element along this path contains one of the class names specified in the "classNames" array.
 *
 * @param fromElement
 * @param toElement
 * @param classNames
 */
export function isAnyParentHasClass(fromElement: EventTarget, toElement: Node, classNames: string[]): boolean {
    let el = fromElement as HTMLElement;
    while (el && toElement !== el) {
        if (el.classList && classNames.some((className) => el.classList.contains(className))) {
            return true;
        }
        el = _getParentElement(el) as HTMLElement;
    }
    return false;
}

export function blurFocusedElement() {
    const elem = _getActiveElement() as HTMLElement;
    elem?.blur();
}

export function preventDefaultIfTargetFocused(e: Event) {
    if (_getActiveElement() === e.target) {
        e.preventDefault();
    }
}

/**
 * Works exactly like native "closest" method, with next enhancements:
 * - supports HTMLElement as a selector
 * - takes Event as an input and performs search for the "event target" or "event related target" for focus/blur events.
 *
 * @param event
 * @param condition
 */
export function closestTargetParentByCondition(e: Event, condition: string | HTMLElement) {
    const element = _getInteractionTarget(e) as HTMLElement;
    if (!element || !condition) {
        return null;
    }
    const conditionCallback = (elem: HTMLElement) => {
        if (typeof condition === 'string') {
            return elem.matches(condition);
        }
        return condition === elem;
    };
    if (conditionCallback(element)) {
        return element;
    }
    let parent = _getParentElement(element) as HTMLElement;
    while (parent) {
        if (conditionCallback(parent)) {
            return parent as HTMLElement;
        }
        parent = _getParentElement(parent) as HTMLElement;
    }
    return null;
}

export function getScrollParentOfEventTarget(event: Event, dimension: 'x' | 'y'): HTMLElement {
    const node = _getEventTarget(event) as HTMLElement;
    return _getScrollParent(node, dimension);
}

/**
 * ↓ PRIVATE methods below this comment ↓
 */

/**
 * Works as normal "element.parentElement" with next enhancement:
 * - If direct parent element is a shadow root, then it returns the shadow host element instead of null.
 * @param element
 */
function _getParentElement(element: Element) {
    let parentElem: Element = element.parentElement;
    const parentNode: Node = element.parentNode;
    if (!parentElem && parentNode instanceof ShadowRoot) {
        parentElem = parentNode.host;
    }
    return parentElem;
}

/**
 * Works as normal "document.activeElement" with next enhancement:
 * - if focused element is located inside shadow DOM, then it returns actual focused element instead of the shadow DOM host.
 */
function _getActiveElement(): HTMLElement | null {
    const activeEl = document.activeElement || null;
    if (activeEl && activeEl.shadowRoot) {
        return activeEl.shadowRoot.activeElement as HTMLElement;
    }
    return activeEl as HTMLElement;
}

function _getScrollParent(node: HTMLElement, dimension: 'x' | 'y'): HTMLElement {
    if (node == null) {
        return null;
    }

    const isElement = node instanceof HTMLElement;
    const style = isElement && window.getComputedStyle(node);

    let overflow: string;
    let scrollSize: number;
    let clientSize: number;

    if (dimension === 'x') {
        overflow = style && style.overflowX;
        scrollSize = node.scrollWidth;
        clientSize = node.clientWidth;
    } else {
        overflow = style && style.overflowY;
        scrollSize = node.scrollHeight;
        clientSize = node.clientHeight;
    }

    const isScrollable = overflow !== 'visible' && overflow !== 'hidden';

    if (isScrollable && scrollSize > clientSize) {
        return node;
    } else {
        return _getScrollParent(_getParentElement(node) as HTMLElement, dimension);
    }
}

/**
 * 1. For native Event - works as normal "event.target" with next enhancement:
 *    - If event occurs inside shadow DOM and caught outside the shadow dom then the real target is returned instead of the shadow DOM host.
 * 2. For React synthetic event - just returns "event.target" because it already points to the actual target.
 *
 * @param event
 */
function _getEventTarget(event: Event | React.SyntheticEvent) {
    if (event instanceof Event) {
        let target;
        if (['focus', 'blur', 'focusin', 'focusout'].includes(event.type)) {
            target = (event as FocusEvent).relatedTarget;
        } else {
            target = event.target;
        }

        if (target instanceof Element && target.shadowRoot) {
            /**
             * If event occurs inside shadow DOM and caught outside the shadow dom,
             * then "event.target" points to the shadow dom host, instead of the real target
             */
            return event.composedPath()[0];
        }
        return target;
    }
    // event target is always correct in synthetic events.
    return event.target;
}

const _isFocusEvent = (e: Event | React.SyntheticEvent | FocusEvent): e is FocusEvent =>
    ['focus', 'blur', 'focusin', 'focusout'].includes(e.type);

function _getInteractionTarget(e: Event | React.SyntheticEvent) {
    if (_isFocusEvent(e)) {
        return e.relatedTarget;
    }

    return _getEventTarget(e);
}
