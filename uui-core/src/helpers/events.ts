import * as React from 'react';
import { uuiMarkers } from '../constants';

export function isClickableChildClicked(e: React.SyntheticEvent<Element>): boolean {
    return isChildHasClass(e.target, e.currentTarget, [uuiMarkers.clickable]);
}

export function isChildFocusable(e: React.FocusEvent<HTMLElement>): boolean {
    return isChildHasClass(e.relatedTarget, e.target as unknown as Node, [uuiMarkers.lockFocus]);
}

export function isChildHasClass(target: EventTarget | null, currentTarget: Node, classNames: string[]): boolean {
    let el: HTMLElement | null = target as HTMLElement;
    while (el && currentTarget !== el) {
        if (el.classList && classNames.some((className) => el?.classList.contains(className))) {
            return true;
        }
        el = el.parentElement;
    }
    return false;
}

export function handleSpaceKey(e: any, cb: any): void {
    if (e.keyCode === 32) {
        e.preventDefault();
        cb(e);
    }
}
