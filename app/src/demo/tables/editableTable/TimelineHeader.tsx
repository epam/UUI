import React, { useCallback, useEffect, useRef } from 'react';
import { useForceUpdate, useResizeObserver } from '@epam/uui-core';
import { TimelineController, TimelineScale } from '@epam/uui-timeline';
import css from './TimelineHeader.module.scss';

export interface TimelineHeaderProps {
    timelineController: TimelineController;
}

export function TimelineHeader({ timelineController }: TimelineHeaderProps) {
    const forceUpdate = useForceUpdate();
    const timelineRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        timelineController.setWidth(timelineRef.current?.offsetWidth);
    }, [forceUpdate, timelineController]);

    const onResize = useCallback(() => {
        timelineController.setViewport(
            {
                center: timelineController.currentViewport.center,
                pxPerMs: timelineController.currentViewport.pxPerMs,
                widthPx: timelineRef.current?.clientWidth,
            },
            false,
        );
    }, [
        timelineController,
    ]);

    useResizeObserver({
        onResize: onResize,
        observables: [document.body, timelineRef.current],
        delay: 150,
    });

    return (
        <div ref={ timelineRef } className={ css.timeline }>
            <div
                className={ css.layer }
            >
                <TimelineScale
                    timelineController={ timelineController }
                    isDraggable={ true }
                />
            </div>
        </div>
    );
}
