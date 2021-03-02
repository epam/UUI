import * as React from 'react';
import { uuiMarkers } from '../constants';

export function isClickableChildClicked(e: React.SyntheticEvent<any>): boolean {
    return isChildHasClass(e.target, e.currentTarget, [uuiMarkers.clickable]);
}

export function isChildHasClass(target: EventTarget, currentTarget: Node, classNames: string[]): boolean {
    let el = target as any;
    while (el && currentTarget != el) {
        if (el.classList && classNames.some(className => el.classList.contains(className))) {
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