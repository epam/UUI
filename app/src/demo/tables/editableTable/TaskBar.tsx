import React, { useCallback, useRef } from 'react';
import { TimelineTransform, useCanvas, BaseTimelineCanvasComponentProps, TimelineGrid, Item } from '@epam/uui-timeline';
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

        // if (task.dueDate) {
        //     item = {
        //         from: startDate ? uuiDayjs.dayjs(startDate, 'YYYY-MM-DD').toDate() : null,
        //         to: task.dueDate ? uuiDayjs.dayjs(task.dueDate, 'YYYY-MM-DD').toDate() : null,
        //         color: getTaskColor(task.status),
        //         minPixPerDay: 0.01,
        //         fillType: 'solid',
        //         opacity: 1.0,
        //         height: 30,
        //     };
        // } else {
        let to = uuiDayjs.dayjs(startDate, 'YYYY-MM-DD').toDate();
        if (startDate && task.estimate !== undefined) {
            to = new Date(to.getTime() + task.estimate * 24 * 60 * 60 * 1000);
        } else {
            to = null;
        }

        const item: Item = {
            from: startDate ? uuiDayjs.dayjs(startDate, 'YYYY-MM-DD').toDate() : null,
            to,
            color: getTaskColor(task.status),
            minPixPerDay: 0.1,
            fillType: 'solid',
            opacity: 1.0,
            height: 30,
        };

        let deadlineItems: Item[] = [];
        const dueDate = uuiDayjs.dayjs(task.dueDate, 'YYYY-MM-DD').toDate();
        if (task.type === 'task' && task.dueDate && to.getTime() > dueDate.getTime()) {
            deadlineItems = [{
                from: dueDate,
                to,
                color: 'red',
                minPixPerDay: 0.1,
                fillType: 'solid',
                opacity: 1.0,
                height: 30,
            }, {
                from: dueDate,
                to,
                color: 'red',
                minPixPerDay: 0.1,
                fillType: 'shaded',
                opacity: 0.7,
                height: 30,
            }];
        }
        // }

        const transformedItems = [item, ...deadlineItems]
            .filter(Boolean)
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

    return (
        <div ref={ taskBarWrapperRef } className={ css.taskBar }>
            <div className={ css.layer }>
                <TimelineGrid
                    timelineController={ timelineController }
                    canvasHeight={ canvasHeight }
                />
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
