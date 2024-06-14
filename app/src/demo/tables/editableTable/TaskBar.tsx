import React, { useCallback, useEffect, useRef } from 'react';
import { TimelineTransform, useCanvas, BaseTimelineCanvasComponentProps, Item, TimelineGrid } from '@epam/uui-timeline';
import { useForceUpdate } from '@epam/uui-core';
import { renderBars } from '@epam/uui-timeline';
import { Task } from './types';
import { statuses } from './demoData';
import css from './TaskBar.module.scss';

export interface TaskBarProps extends BaseTimelineCanvasComponentProps {
    task: Task;
}

const getTaskColor = (status: string) => statuses.find((s) => s.id === +status)?.color ?? '#e1e3eb';

export function TaskBar({ task, timelineController }: TaskBarProps) {
    const taskBarWrapperRef = useRef<HTMLDivElement>(null);
    const forceUpdate = useForceUpdate();
    const canvasHeight = 36;
    useEffect(() => {
        timelineController.subscribe(forceUpdate);
        return () => timelineController.unsubscribe(forceUpdate);
    }, [forceUpdate, timelineController]);
    
    const draw = useCallback((ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        ctx.clearRect(0, 0, t.widthMs, canvasHeight);
        const item: Item = {
            from: task.startDate ? new Date(task.startDate) : null,
            to: task.dueDate ? new Date(task.dueDate) : null,
            color: getTaskColor(task.status),
            minPixPerDay: 0.1,
            fillType: 'solid',
            opacity: 1.0,
            height: 30,
        };

        let to = new Date(task.startDate);
        if (task.startDate && task.estimate) {
            to.setDate(to.getDate() + task.estimate);
        } else {
            to = null;
        }
        const estimatedItem: Item = {
            from: task.startDate ? new Date(task.startDate) : null,
            to,
            color: 'grey',
            minPixPerDay: 0.1,
            fillType: 'shaded',
            opacity: task.estimate ? 0.6 : 0,
            height: 30,
        };

        const transformedItems = [item, estimatedItem]
            .map((i) => ({
                ...i,
                priority: 1,
                ...t.transformSegment(i.from, i.to),
            })).filter((i) => i.from !== null && i.to !== null && i.isVisible && i.opacity > 0.01);

        renderBars(transformedItems, canvasHeight, ctx, t);
    }, [task.dueDate, task.estimate, task.startDate, task.status]);

    const { renderCanvas } = useCanvas({
        draw,
        canvasHeight,
        timelineController,
    });

    return (
        <div
            ref={ taskBarWrapperRef }
            className={ css.taskBar }
            onWheel={ (e) => timelineController.handleWheelEvent(e.nativeEvent as WheelEvent) }
        >
            <div className={ css.layer }>
                <TimelineGrid className={ css.grid } timelineController={ timelineController } canvasHeight={ 36 } />
            </div>
            <div
                className={ css.layer }
                onMouseDown={ (e) => timelineController.startDrag(e) }
            >
                {renderCanvas()}
            </div>
          
        </div>
    );
}
