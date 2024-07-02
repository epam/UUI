import React, { useCallback, useRef } from 'react';
import { TimelineTransform, useCanvas, BaseTimelineCanvasComponentProps, Item, 
    useSharedTimelineGrid,
} from '@epam/uui-timeline';
import { renderBars } from '@epam/uui-timeline';
import { Task } from './types';
import { statuses } from './demoData';
import { uuiDayjs } from '../../../helpers';
import css from './TaskBar.module.scss';

export interface TaskBarProps extends BaseTimelineCanvasComponentProps {
    task: Task;
}

const getTaskColor = (status: string) => statuses.find((s) => s.id === status)?.color ?? '#e1e3eb';

export function TaskBar({ task, timelineController }: TaskBarProps) {
    const taskBarWrapperRef = useRef<HTMLDivElement>(null);
    const canvasHeight = 36;

    const draw = useCallback((ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        ctx.clearRect(0, 0, t.widthMs, canvasHeight);
        const startDate = task.type === 'story' ? task.startDate : task.exactStartDate;
        let to = uuiDayjs.dayjs(startDate, 'YYYY-MM-DD');
        
        if (startDate && task.estimate) {
            to = to.add(task.estimate, 'day');
        } else {
            to = null;
        }

        const item: Item = task.dueDate ? {
            from: startDate ? uuiDayjs.dayjs(startDate, 'YYYY-MM-DD').toDate() : null,
            to: task.dueDate ? uuiDayjs.dayjs(task.dueDate, 'YYYY-MM-DD').toDate() : null,
            color: getTaskColor(task.status),
            minPixPerDay: 0.01,
            fillType: 'solid',
            opacity: 1.0,
            height: 30,
        } : {
            from: startDate ? uuiDayjs.dayjs(startDate, 'YYYY-MM-DD').toDate() : null,
            to: to ? to.toDate() : null,
            color: getTaskColor(task.status),
            minPixPerDay: 0.01,
            fillType: 'solid',
            opacity: 1.0,
            height: 30,
        };

        const transformedItems = [item]
            .map((i) => ({
                ...i,
                priority: 1,
                ...t.transformSegment(i.from, i.to),
            }))
            .filter((i) => i.from !== null && i.to !== null && i.isVisible && i.opacity > 0.01);

        renderBars(transformedItems, canvasHeight, ctx, t);
    }, [task.type, task.startDate, task.exactStartDate, task.estimate, task.dueDate, task.status]);

    const { renderCanvas } = useCanvas({
        draw,
        canvasHeight,
        timelineController,
    });

    const timelineGrid = useSharedTimelineGrid();

    return (
        <div ref={ taskBarWrapperRef } className={ css.taskBar }>
            <div className={ css.layer }>
                {timelineGrid}
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
