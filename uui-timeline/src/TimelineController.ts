import * as React from 'react';
import { Viewport, ViewportRange } from './types';
import { getScaleByRange, msPerDay, scaleSteps } from './helpers';
import { TimelineTransform } from '../';
import sortedIndex from 'lodash.sortedindex';
import { isClientSide } from '@epam/uui-core';

type TimelineRenderHandler = (transform: TimelineTransform) => void;

export interface TimelineControllerOptions {
    isHoliday?: (date: Date) => boolean;
    minWidth?: number;
    minVisibleDate?: Date;
    minScale?: number;
    maxScale?: number;
}

interface ScaleState {
    minPxPerDay?: number;
    maxPxPerDay?: number;
    visibility: number;
}

export class TimelineController {
    dragStartViewport: Viewport;
    currentViewport: Viewport;
    targetViewport: Viewport;
    options: TimelineControllerOptions;
    screenMouseX = 0;
    screenMouseY = 0;
    dragStartMouseX = 0;
    isDragging = false;
    isFrameScheduled = false;
    scalesVisibility: { [key: string]: ScaleState } = {};
    shiftPercent: number = 0.3;
    cache: Record<string, TimelineTransform> = {};

    onViewportChange: (newViewport: Viewport) => void;
    constructor(viewport?: Viewport, options?: TimelineControllerOptions, onViewportChange?: (newViewport: Viewport) => void) {
        if (!viewport) {
            const viewportValue = localStorage.getItem('timeline')
                ? JSON.parse(localStorage.getItem('timeline'))
                : {
                    center: new Date(),
                    pxPerMs: 1 / msPerDay,
                    widthPx: 586,
                };

            viewport = {
                ...viewportValue,
                widthPx: options && options.minWidth && viewportValue.widthPx < options.minWidth ? options.minWidth : viewportValue.widthPx,
                center: new Date(viewportValue.center),
            };
        }

        this.currentViewport = viewport;
        this.targetViewport = viewport;
        this.onViewportChange = onViewportChange;
        this.options = options ? options : {};
        if (isClientSide) {
            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('mouseup', this.handleMouseUp);
            window.addEventListener('mouseleave', this.handleMouseLeave);
        }
    }

    handlers: TimelineRenderHandler[] = [];
    public subscribe(handler: TimelineRenderHandler) {
        this.handlers.push(handler);
    }

    public unsubscribe(handler: TimelineRenderHandler) {
        this.handlers = this.handlers.filter((h) => h != handler);
    }

    public setViewport(newViewport: Viewport, doAnimation: boolean) {
        this.targetViewport = newViewport;
        if (!doAnimation) {
            this.currentViewport = newViewport;
        }

        localStorage.setItem('timeline', JSON.stringify(newViewport));

        this.scheduleUpdate();

        if (this.onViewportChange) {
            this.onViewportChange(newViewport);
        }
    }

    public setViewportRange(newViewportRange: ViewportRange, doAnimation: boolean) {
        const rangeTimestamp = newViewportRange.to.getTime() - newViewportRange.from.getTime();
        const centerTimestamp = Math.floor((newViewportRange.to.getTime() + newViewportRange.from.getTime()) / 2);
        const pxPerMs = getScaleByRange(rangeTimestamp);

        const center = new Date();
        center.setTime(centerTimestamp);
        this.setViewport(
            {
                center,
                widthPx: this.currentViewport.widthPx,
                pxPerMs,
            },
            doAnimation,
        );
    }

    public setShiftPercent(shiftPercent: number) {
        this.shiftPercent = shiftPercent;
    }

    public setWidth(width: number) {
        this.setViewport(
            {
                ...this.currentViewport,
                widthPx: width,
            },
            false,
        );
    }

    public startDrag = (e: React.MouseEvent<HTMLElement>) => {
        if (e.nativeEvent.which === 1) {
            // If left click
            this.isDragging = true;
            this.dragStartViewport = this.currentViewport;
            this.dragStartMouseX = this.screenMouseX;
        }

        // Prevent text selection of drag start
        e.preventDefault();
    };

    public handleWheelEvent = (e: WheelEvent) => {
        const vp = this.currentViewport;
        const sign = e.deltaY ? (e.deltaY < 0 ? 1 : -1) : 0;
        const pxPerMs = this.changeZoomStep(sign);

        this.setViewport(
            {
                ...vp,
                center: new Date(this.getNewCenter({ ...vp, pxPerMs }, vp.center.getTime() + (1 / vp.pxPerMs - 1 / pxPerMs) * ((e as any).layerX - vp.widthPx / 2))),
                pxPerMs,
            },
            true,
        );
        e.preventDefault();
    };

    private changeZoomStep(steps: number) {
        const currentStep = sortedIndex(scaleSteps, this.targetViewport.pxPerMs);
        let targetStep = currentStep + steps;
        if (targetStep < 0) {
            targetStep = 0;
        }
        if (targetStep >= scaleSteps.length) {
            targetStep = scaleSteps.length - 1;
        }
        if (scaleSteps[targetStep] > this.options.maxScale) {
            targetStep = sortedIndex(scaleSteps, this.options.maxScale);
        }
        if (scaleSteps[targetStep] < this.options.minScale) {
            targetStep = sortedIndex(scaleSteps, this.options.minScale);
        }
        return scaleSteps[targetStep];
    }

    public moveToday() {
        this.setViewport(
            {
                ...this.targetViewport,
                center: new Date(),
            },
            true,
        );
    }

    public moveBy(dir: -1 | 1, shiftPercent: number = this.shiftPercent) {
        const screenWidthMs = this.targetViewport.widthPx / this.targetViewport.pxPerMs;
        const newCenterMs = this.getNewCenter(this.targetViewport, this.targetViewport.center.getTime() + screenWidthMs * shiftPercent * dir);

        if (newCenterMs !== this.targetViewport.center.getTime()) {
            this.setViewport(
                {
                    ...this.targetViewport,
                    center: new Date(newCenterMs),
                },
                true,
            );
        }
    }

    public zoomTo(pxPerMs: number) {
        const vp = this.targetViewport;

        this.setViewport(
            {
                ...vp,
                pxPerMs,
            },
            true,
        );
    }

    public zoomBy(steps: number) {
        const vp = this.targetViewport;
        const pxPerMs = this.changeZoomStep(steps);

        this.setViewport(
            {
                ...vp,
                pxPerMs,
            },
            true,
        );
    }

    public canZoomBy(steps: number) {
        return this.changeZoomStep(steps) != this.targetViewport.pxPerMs;
    }

    public getTransform() {
        const bounds = this.getBounds(this.currentViewport);

        const key = `${bounds.left}-${bounds.right}-${this.currentViewport.pxPerMs}`;

        // if (this.cache[key]) {
        //     return this.cache[key];
        // }

        const transform = new TimelineTransform(this, this.currentViewport);

        this.cache[key] = transform;
        return transform;
    }

    private doRender() {
        const transform = this.getTransform();
        this.handlers.forEach((h) => h && h(transform));
    }

    private interpolate(current: number, target: number, dt: number, force: number = 0.01) {
        for (let n = 0; n < dt; n += 1) {
            current = current * (1 - force) + target * force;
        }
        return current;
    }

    getBounds = (vp: Viewport) => ({
        left: vp.center.getTime() - 0.5 / vp.pxPerMs,
        right: vp.center.getTime() + 0.5 / vp.pxPerMs,
    });

    private interpolateViewports(vp1: Viewport, vp2: Viewport, dt: number) {
        // We'll process interpolation not scale+center, but two points -0.5ms and 0.5.
        // This will made transition trajectory linear

        const vp1Bounds = this.getBounds(vp1);
        const vp2Bounds = this.getBounds(vp2);
        const nextBounds = {
            left: this.interpolate(vp1Bounds.left, vp2Bounds.left, dt),
            right: this.interpolate(vp1Bounds.right, vp2Bounds.right, dt),
        };

        const nextViewport = {
            ...vp1,
            center: new Date((nextBounds.left + nextBounds.right) / 2),
            pxPerMs: 1 / Math.abs(nextBounds.left - nextBounds.right),
        };

        // Calculate maximum distance in PX that leftmost or rightmost point of the screen is moved during this step
        const halfScreenMs = vp2.widthPx / vp2.pxPerMs / 2;
        const screenLeftMs = vp2.center.getTime() - halfScreenMs;
        const screenRightMs = vp2.center.getTime() + halfScreenMs;

        const getX = (ms: number, vp: Viewport) => (ms - vp.center.getTime()) * vp.pxPerMs + vp.widthPx / 2;

        const deltaPx = Math.max(
            Math.abs(getX(screenLeftMs, nextViewport) - getX(screenLeftMs, vp2)),
            Math.abs(getX(screenRightMs, nextViewport) - getX(screenRightMs, vp2)),
        );

        return { nextViewport, deltaPx };
    }

    private isScaleVisible(minPxPerDay?: number, maxPxPerDay?: number) {
        const pxPerDay = this.currentViewport.pxPerMs * msPerDay;
        return (!minPxPerDay || minPxPerDay <= pxPerDay) && (!maxPxPerDay || pxPerDay < maxPxPerDay) ? 1 : 0;
    }

    public getScaleVisibility(minPxPerDay?: number, maxPxPerDay?: number) {
        const key = (minPxPerDay || 'null') + '-' + (maxPxPerDay || 'null');
        if (!this.scalesVisibility[key]) {
            this.scalesVisibility[key] = {
                minPxPerDay,
                maxPxPerDay,
                visibility: this.isScaleVisible(minPxPerDay, maxPxPerDay),
            };
        }
        return this.scalesVisibility[key].visibility;
    }

    public updateScalesVisibility(dt: number, animate: boolean) {
        const sigma = 0.05;
        let maxDelta = 0;
        Object.keys(this.scalesVisibility).forEach((key) => {
            const scale = this.scalesVisibility[key];
            const currentVisibility = this.isScaleVisible(scale.minPxPerDay, scale.maxPxPerDay);
            if (animate) {
                // If we are far from visible range - increase animation speed
                const doubleBoundsVisible = this.isScaleVisible(scale.minPxPerDay / 2, scale.maxPxPerDay * 2);
                const speed = doubleBoundsVisible ? 0.02 : 1;
                scale.visibility = this.interpolate(scale.visibility, currentVisibility, dt, speed);
                if (scale.visibility < sigma) {
                    scale.visibility = 0;
                }
                if (scale.visibility > 1 - sigma) {
                    scale.visibility = 1;
                }
            } else {
                scale.visibility = currentVisibility;
            }
            const delta = Math.abs(currentVisibility - scale.visibility);
            if (delta > maxDelta) {
                maxDelta = delta;
            }
        });
        return maxDelta;
    }

    private lastRenderTimestamp = 0;
    private scheduleUpdate() {
        if (this.isFrameScheduled) {
            return;
        }

        this.isFrameScheduled = true;

        window.requestAnimationFrame(() => {
            const t = new Date().getTime();
            let dt = 16;
            if (this.lastRenderTimestamp) {
                dt = t - this.lastRenderTimestamp;
            }
            this.lastRenderTimestamp = t;
            if (dt > 100) {
                dt = 100;
            }

            this.isFrameScheduled = false;
            const { nextViewport, deltaPx } = this.interpolateViewports(this.currentViewport, this.targetViewport, dt);
            const deltaVis = this.updateScalesVisibility(dt, true);
            this.doRender();
            if (deltaPx > 1 || deltaVis > 0) {
                this.currentViewport = nextViewport;
                this.scheduleUpdate();
            } else {
                this.currentViewport = this.targetViewport;
                this.lastRenderTimestamp = 0;
            }
        });
    }

    private getNewCenter(vp: Viewport, newCenterMs: number) {
        if (!this.options.minVisibleDate) {
            return newCenterMs;
        }
        const screenWidthMs = vp.widthPx / vp.pxPerMs;
        const minCenterDateMs = this.options.minVisibleDate.getTime() + screenWidthMs / 2;

        if (newCenterMs < minCenterDateMs) {
            return minCenterDateMs;
        } else {
            return newCenterMs;
        }
    }

    private handleMouseMove = (e: MouseEvent) => {
        this.screenMouseX = e.screenX;
        this.screenMouseY = e.screenY;
        if (this.isDragging) {
            const vp = this.dragStartViewport;
            const dx = e.screenX - this.dragStartMouseX;
            const dt = -(dx / vp.pxPerMs);
            const newCenterMs = this.getNewCenter(vp, vp.center.getTime() + dt);

            if (newCenterMs !== vp.center.getTime()) {
                this.setViewport(
                    {
                        ...vp,
                        center: new Date(newCenterMs),
                    },
                    false,
                );
            }
        }
    };

    private handleMouseUp = () => {
        this.isDragging = false;
    };

    private handleMouseLeave = () => {
        this.isDragging = false;
    };
}
