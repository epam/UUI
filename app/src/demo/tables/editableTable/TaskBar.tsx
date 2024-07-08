import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { TimelineTransform, BaseTimelineCanvasComponentProps, TimelineGrid } from '@epam/uui-timeline';
import { Task } from './types';
import { statuses } from './demoData';
import { uuiDayjs } from '../../../helpers';

import css from './TaskBar.module.scss';

export interface TaskBarProps extends BaseTimelineCanvasComponentProps {
    task: Task;
}

const getTaskColor = (status: string) => statuses.find((s) => s.id === status)?.color ?? '#e1e3eb';

function TaskC({ task, timelineController }: TaskBarProps) {
    const [coords, setCoords] = useState<Record<string, { left: number, width: number }>>({});

    const taskChunks = useMemo(() => {
        const startDate = task.type === 'story' ? task.startDate : task.exactStartDate;

        let to = uuiDayjs.dayjs(startDate, 'YYYY-MM-DD').toDate();
        if (startDate && task.estimate !== undefined) {
            to = new Date(to.getTime() + task.estimate * 24 * 60 * 60 * 1000);
        } else {
            to = null;
        }
    
        const item = {
            id: task.id,
            from: startDate ? uuiDayjs.dayjs(startDate, 'YYYY-MM-DD').toDate() : null,
            to,
            color: getTaskColor(task.status),
            minPixPerDay: 0.1,
            fillType: 'solid',
            opacity: 1.0,
            height: 30,
        };
    
        let deadline;
        const dueDate = uuiDayjs.dayjs(task.dueDate, 'YYYY-MM-DD').toDate();
        if (task.type === 'task' && task.dueDate && to.getTime() > dueDate.getTime()) {
            deadline = {
                id: `${task.id}-deadline`,
                from: dueDate,
                to,
                color: 'red',
                minPixPerDay: 0.1,
                fillType: 'solid',
                opacity: 1.0,
                height: 30,
            };
        }
        return [item, deadline].filter(Boolean);
    }, [task.dueDate, task.estimate, task.exactStartDate, task.id, task.startDate, task.status, task.type]);
    
    const updateCoords = useCallback((t: TimelineTransform) => {
        const newCoords = taskChunks.reduce<Record<string, { left: number, width: number }>>((acc, i) => {
            const segment = { ...i, ...t.transformSegment(i.from, i.to) };
            const include = segment.from !== null && segment.to !== null && segment.isVisible && segment.opacity > 0.01;
            if (!include) {
                return acc;
            }
            const left = t.getX(i.from);
            const width = t.getX(i.to) - t.getX(i.from);
            
            acc[i.id] = { left, width };
            return acc;
        }, {});
        setCoords(newCoords);
    }, [taskChunks]);

    useLayoutEffect(() => {
        timelineController.subscribe(updateCoords);
        return () => timelineController.unsubscribe(updateCoords);
    }, [timelineController, updateCoords]);

    const conf = taskChunks
        .filter((i) => coords[i.id] !== undefined)
        .map((i) => {
            return { key: i.id, style: { position: 'absolute' as any, height: i.height ? i.height : 18, background: i.color, ...coords[i.id] } };
        });

    return <>{conf.map((c) => <div { ...c } />)}</>;
}

export function TaskBar({ task, timelineController }: TaskBarProps) {
    const taskBarWrapperRef = useRef<HTMLDivElement>(null);
    const canvasHeight = 36;

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
                <TaskC task={ task } timelineController={ timelineController } />
            </div>
        </div>
    );
}
