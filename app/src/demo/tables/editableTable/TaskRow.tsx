import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { TimelineTransform, TimelineGrid, TimelineController, CanvasProps } from '@epam/uui-timeline';
import { Task } from './types';
import { statuses } from './demoData';
import { uuiDayjs } from '../../../helpers';

import css from './TaskRow.module.scss';

export interface TaskRowProps extends CanvasProps {
    task: Task;
}

const getTaskColor = (status: string) => statuses.find((s) => s.id === status)?.color ?? '#e1e3eb';

function TaskBar({ task, timelineController }: { task: Task, timelineController: TimelineController }) {
    const [coords, setCoords] = useState<{ width?: number, left?: number }>({});
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

    const updateCoords = useCallback((t: TimelineTransform) => {
        const segment = { ...t.transformSegment(item.from, item.to) };
        const left = t.getX(item.from);
        const width = t.getX(item.to) - t.getX(item.from);
        const includes = segment !== undefined && item.from !== null && item.to !== null && segment.isVisible && item.opacity > 0.01;
        if (!includes) {
            setCoords(null);
        } else if (width !== coords?.width || left !== coords?.left) {
            setCoords({ left, width });
        }
    }, [coords?.left, coords?.width, item.from, item.opacity, item.to]);

    useLayoutEffect(() => {
        updateCoords(timelineController.getTransform());
        timelineController.subscribe(updateCoords);
        return () => timelineController.unsubscribe(updateCoords);
    }, [timelineController, updateCoords]);

    if (!coords) {
        return;
    }

    return (
        <div
            key={ item.id }
            style={ {
                position: 'absolute' as any,
                height: item.height ?? 18,
                background: item.color,
                width: `${coords.width}px`,
                left: `${coords.left}px`,
            } }
        />
    );
}

export function TaskRow({ task, timelineController }: TaskRowProps) {
    const taskBarWrapperRef = useRef<HTMLDivElement>(null);
    const canvasHeight = 36;
    return (
        <div ref={ taskBarWrapperRef } className={ css.taskBar }>
          
            <div
                className={ css.layer }
            >
                <TimelineGrid
                    timelineController={ timelineController }
                    canvasHeight={ canvasHeight }
                />
            </div>
            <div
                className={ css.layer }
                onMouseDown={ (e) => timelineController.startDrag(e) }
            >
                <TaskBar task={ task } timelineController={ timelineController } />
            </div>
        </div>
    );
}
