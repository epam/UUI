import React, { useEffect, useRef } from 'react';
import { useForceUpdate } from '@epam/uui-core';
import { TimelineController, TimelineGrid, TimelineScale, msPerDay } from '@epam/uui-timeline';
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
        window.onresize = () => {
            timelineController.setViewport(
                {
                    center: timelineController.currentViewport.center,
                    pxPerMs: timelineRef.current?.clientWidth / msPerDay,
                    widthPx: timelineRef.current.clientWidth,
                },
                false,
            );
            forceUpdate();
        };
        
        return () => {
            window.onresize = null;
        };
    }, [forceUpdate, timelineController]);

    return (
        <div
            ref={ timelineRef }
            className={ css.timeline }
            onWheel={ (e) => timelineController.handleWheelEvent(e.nativeEvent as WheelEvent) }
        >
            <div className={ css.layer } onMouseDown={ timelineController.startDrag }>
                <TimelineGrid className={ css.grid } timelineController={ timelineController } />
            </div>
            <div className={ css.layer } onMouseDown={ timelineController.startDrag }>
                <TimelineScale timelineController={ timelineController } />
            </div>
        </div>
    );
}
