import { IHasChildren, IHasCX } from "../props";
import { Placement, Boundary } from '@popperjs/core';
import type { Options } from '@popperjs/core/lib/modifiers/offset';
import React from "react";

export interface TooltipCoreProps extends IHasCX, IHasChildren {
    content?: any;
    renderContent?(): any;
    placement?: Placement;
    trigger?: 'click' | 'press' | 'hover' | 'manual';
    isVisible?: boolean;
    portalTarget?: HTMLElement;
    offset?: Options['offset'];
    children?: React.ReactNode;
    boundaryElement?: Boundary;
}