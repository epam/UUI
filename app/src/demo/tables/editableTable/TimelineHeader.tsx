import React, { useCallback, useEffect, useRef } from 'react';
import { useForceUpdate, useResizeObserver } from '@epam/uui-core';
import { TimelineController, TimelineGrid, TimelineScale } from '@epam/uui-timeline';
import css from './TimelineHeader.module.scss';

export interface TimelineHeaderProps {
    timelineController: TimelineController;
}

export function TimelineHeader({ timelineController }: TimelineHeaderProps) {
    const forceUpdate = useForceUpdate();
    const timelineRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        timelineController.setWidth(timelineRef.current?.offsetWidth);
        forceUpdate();
    }, [forceUpdate, timelineController]);

    const onResize = useCallback(() => {
        timelineController.setViewport(
            {
                center: timelineController.currentViewport.center,
                pxPerMs: timelineController.currentViewport.pxPerMs,
                widthPx: timelineRef.current.clientWidth,
            },
            false,
        );
        forceUpdate();
    }, [forceUpdate, timelineController]);

    useResizeObserver({
        onResize: onResize,
        observables: [document.body, timelineRef.current],
        delay: 100,
    });

    return (
        <div ref={ timelineRef } className={ css.timeline }>
            <div className={ css.layer } onMouseDown={ timelineController.startDrag }>
                <TimelineGrid className={ css.grid } timelineController={ timelineController } />
            </div>
            <div className={ css.layer } onMouseDown={ timelineController.startDrag }>
                <TimelineScale timelineController={ timelineController } />
            </div>
        </div>
    );
}