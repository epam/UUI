import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { TimelineTransform, TimelineController } from '@epam/uui-timeline';
import { Text } from '@epam/uui';
import { Task } from './types';
import { resources, statuses } from './demoData';
import { uuiDayjs } from '../../../helpers';

import css from './TaskBar.module.scss';

const getTaskColor = (status: string) => statuses.find((s) => s.id === status)?.color ?? '#e1e3eb';

export function TaskBar({ task, timelineController }: { task: Task, timelineController: TimelineController }) {
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

    const assignee = useMemo(
        () => resources.find((r) => r.id === task.assignee),
        [task.assignee],
    );

    if (!coords) {
        return;
    }

    return (
        <div
            key={ item.id }
            style={ {
                position: 'absolute' as any,
                height: (item.height ?? 18) * devicePixelRatio,
                background: item.color,
                width: `${coords.width}px`,
                left: 0,
                transform: `translateX(${coords.left}px)`,
                translate: 'transform linear', 
            } }
        >
            { coords.width > 50 && <Text color="white" cx={ css.assingeeText }>{assignee?.fullName}</Text> }
        </div>
    );
}
