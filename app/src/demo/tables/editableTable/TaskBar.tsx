import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { TimelineTransform, TimelineController } from '@epam/uui-timeline';
import { Badge, FlexCell, FlexRow, Text, Tooltip } from '@epam/uui';
import { Task } from './types';
import { resources, statuses } from './demoData';
import { uuiDayjs } from '../../../helpers';

import css from './TaskBar.module.scss';
import classNames from 'classnames';
import { formatDatePickerDate, getDueDateFromTask, getEstimatedTo, getTaskBarWidth, getTaskColor, getTo, getWidth } from './helpers';

interface Coordinates {
    width?: number;
    taskBarWidth?: number;
    deadlineBarWidth?: number;
    left?: number;
}

export function TaskBar({ task, timelineController }: { task: Task, timelineController: TimelineController }) {
    const [coords, setCoords] = useState<Coordinates | null>(null);
    const startDate = task.type === 'story' ? task.startDate : task.exactStartDate;

    const deadline = getDueDateFromTask(task);

    const item = {
        id: task.id,
        from: startDate ? uuiDayjs.dayjs(startDate, 'YYYY-MM-DD').toDate() : null,
        to: getTo(task),
        deadline,
        estimatedTo: getEstimatedTo(task),
        color: getTaskColor(task.status),
        minPixPerDay: 0.1,
        fillType: 'solid',
        opacity: 1.0,
        height: 30,
    };

    const updateCoords = useCallback((t: TimelineTransform) => {
        const segment = { ...t.transformSegment(item.from, item.to) };
        const includes = segment !== undefined && item.from !== null && item.to !== null && segment.isVisible && item.opacity > 0.01;
        if (!includes) {
            setCoords(null);
        } else {
            const realWidth = getWidth(item.from, item.to, t);
            const taskBarWidth = getTaskBarWidth(item.from, item.deadline, item.estimatedTo, t);
            const originalLeft = t.getX(item.from);
            const left = Math.max(originalLeft, 0);

            if (realWidth !== coords?.width
                || left !== coords?.left
                || taskBarWidth !== coords.taskBarWidth
            ) {
                setCoords({ left, width: realWidth, taskBarWidth });
            }
        }
    }, [coords?.left, coords?.taskBarWidth, coords?.width, item.deadline, item.estimatedTo, item.from, item.opacity, item.to]);

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

    const status = statuses.find((s) => s.id === task.status);
    const renderTaskStatus = () => {
        const outOfDeadline = item.deadline && item.deadline.getTime() < item.to.getTime(); 
        return (
            <div>
                <Text cx={ css.header } fontSize="14" lineHeight="18" fontWeight="600">
                    {task.name}
                </Text>
                <FlexRow columnGap="12" alignItems="center" justifyContent="start" size="24">
                    <FlexCell width="auto" minWidth={ 100 }>
                        <Text cx={ css.content } fontSize="12" lineHeight="18" fontWeight="600">
                            Status:
                        </Text>
                    </FlexCell>
                    <FlexCell width="auto">
                        <Badge
                            size="18"
                            color="neutral"
                            icon={ () => <span className={ css.dot } style={ { backgroundColor: item.color } } /> }
                            fill="outline"
                            caption={ status.name }
                        />
                    </FlexCell>
                </FlexRow>
                { task.type === 'task'
                && (
                    <FlexRow columnGap="12" size="24" alignItems="center" justifyContent="start">
                        <FlexCell width="auto" minWidth={ 100 }>
                            <Text cx={ css.content } fontSize="12" lineHeight="18" fontWeight="600">
                                Assignee:
                            </Text>
                        </FlexCell>
                        <FlexCell width="auto" textAlign="right">
                            <Text cx={ css.content } fontSize="12" lineHeight="18">
                                { assignee?.fullName }
                            </Text>
                        </FlexCell>
                    </FlexRow>
                )}
                <FlexRow columnGap="12" size="24" alignItems="center" justifyContent="start">
                    <FlexCell width="auto" minWidth={ 100 }>
                        <Text cx={ css.content } fontSize="12" lineHeight="18" fontWeight="600">
                            Start date:
                        </Text>
                    </FlexCell>
                    <FlexCell width="auto">
                        <Text cx={ css.content } fontSize="12" lineHeight="18">
                            { formatDatePickerDate(task.startDate) }
                        </Text>
                    </FlexCell>
                </FlexRow>
                { task.type === 'task'
                && (
                    <FlexRow columnGap="12" size="24" alignItems="center" justifyContent="start">
                        <FlexCell width="auto" minWidth={ 100 }>
                            <Text cx={ css.content } fontSize="12" lineHeight="18" fontWeight="600">
                                Planned start date:
                            </Text>
                        </FlexCell>
                        <FlexCell width="auto">
                            <Text cx={ css.content } fontSize="12" lineHeight="18">
                                { formatDatePickerDate(task.exactStartDate) }
                            </Text>
                        </FlexCell>
                    </FlexRow>
                )}
                { task.type === 'task' && task.dueDate
                && (
                    <FlexRow columnGap="12" size="24" alignItems="center" justifyContent="start">
                        <FlexCell width="auto" minWidth={ 100 }>
                            <Text cx={ css.content } fontSize="12" lineHeight="18" fontWeight="600" color={ outOfDeadline ? 'critical' : 'primary' }>
                                Due date:
                            </Text>
                        </FlexCell>
                        <FlexCell width="auto">
                            <Text cx={ css.content } fontSize="12" lineHeight="18" color={ outOfDeadline ? 'critical' : 'primary' }>
                                { formatDatePickerDate(task.dueDate) }
                            </Text>
                        </FlexCell>
                    </FlexRow>
                )}
                <FlexRow columnGap="12" size="24" alignItems="center" justifyContent="start">
                    <FlexCell width="auto" minWidth={ 100 }>
                        <Text cx={ css.content } fontSize="12" lineHeight="18" fontWeight="600">
                            Planned end date:
                        </Text>
                    </FlexCell>
                    <FlexCell width="auto">
                        <Text cx={ css.content } fontSize="12" lineHeight="18">
                            { formatDatePickerDate(item.estimatedTo) }
                        </Text>
                    </FlexCell>
                </FlexRow>
            </div>
        );
    };

    return (
        <Tooltip renderContent={ renderTaskStatus } openDelay={ 500 } cx={ css.container } color="neutral">
            <div
                key={ item.id }
                className={ css.taskBarWrapper }
                style={ {
                    height: item.height ?? 18,
                    width: `${coords.width}px`,
                    transform: `translateX(${coords.left}px)`,
                } }
            >
                <div
                    style={ {
                        background: item.color,
                        width: `${coords.taskBarWidth}px`,
                    } }
                    className={ css.taskBar }
                >
                    { coords.taskBarWidth > 50 && <Text color="white" cx={ css.assingeeText }>{ task.name }</Text> }
                </div>
                <div
                    className={ classNames(css.taskBar, css.taskBarDeadline) }
                    style={ { width: `${coords.width - coords.taskBarWidth}px` } }
                >
                </div>
            </div>
        </Tooltip>
    );
}
