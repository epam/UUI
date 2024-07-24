import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { cx } from '@epam/uui-core';
import { TimelineTransform, TimelineController, useTimelineTransform } from '@epam/uui-timeline';
import { Badge, FlexCell, FlexRow, IconContainer, Text, Tooltip } from '@epam/uui';
import { ReactComponent as statusIcon } from '@epam/assets/icons/common/radio-point-10.svg';
import { Task } from './types';
import { resources, statusTags, statuses } from './demoData';
import { uuiDayjs } from '../../../helpers';
import statusCss from './ProjectTableDemo.module.scss';
import css from './TaskBar.module.scss';
import { formatDatePickerDate, getDueDateFromTask, getEstimatedTo, getTaskBarWidth, getTaskColor, getTo, getWidth } from './helpers';

interface PositionConfig {
    width?: number;
    taskBarWidth?: number;
    deadlineBarWidth?: number;
    left?: number;
}

export function TaskBar({ task, timelineController }: { task: Task, timelineController: TimelineController }) {
    const [positionConfig, setPositionConfig] = useState<PositionConfig | null>(null);
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

    const updatePosition = useCallback((t: TimelineTransform) => {
        const segment = { ...t.transformSegment(item.from, item.to) };
        const includes = segment !== undefined && item.from !== null && item.to !== null && segment.isVisible && item.opacity > 0.01;
        if (!includes) {
            setPositionConfig(null);
        } else {
            const realWidth = getWidth(item.from, item.to, t);
            const taskBarWidth = getTaskBarWidth(item.from, item.deadline, item.estimatedTo, t);
            const originalLeft = t.getX(item.from);
            const left = Math.max(originalLeft, 0);

            if (realWidth !== positionConfig?.width
                || left !== positionConfig?.left
                || taskBarWidth !== positionConfig.taskBarWidth
            ) {
                setPositionConfig({ left, width: realWidth, taskBarWidth });
            }
        }
    }, [positionConfig?.left, positionConfig?.taskBarWidth, positionConfig?.width, item.deadline, item.estimatedTo, item.from, item.opacity, item.to]);

    const timelineTransform = useTimelineTransform({ timelineController });

    useLayoutEffect(() => {
        updatePosition(timelineTransform);
    }, [timelineTransform, updatePosition]);

    const assignee = useMemo(
        () => resources.find((r) => r.id === task.assignee),
        [task.assignee],
    );

    if (!positionConfig) {
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
                            icon={ () => (
                                <IconContainer
                                    icon={ statusIcon } 
                                    style={ { marginBottom: '0' } }
                                    cx={
                                        cx(
                                            statusCss.statusIcon,
                                            statusCss[`statusIcon${status.id !== undefined ? statusTags[status?.id] : 'None'}`],
                                        )
                                    }
                                />
                            ) }
                            fill="outline"
                            caption={ status?.name ?? 'None' }
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
    const deadlineWidth = positionConfig.width - positionConfig.taskBarWidth;
    const isMissingDeadline = Math.max(deadlineWidth, 0) !== 0;
    return (
        <Tooltip renderContent={ renderTaskStatus } openDelay={ 500 } cx={ css.container } color="neutral">
            <div
                key={ item.id }
                className={ css.taskBarWrapper }
                style={ {
                    height: item.height ?? 18,
                    width: `${positionConfig.width}px`,
                    transform: `translateX(${positionConfig.left}px)`,
                } }
            >
                <div
                    style={ { width: `${positionConfig.taskBarWidth}px` } }
                    className={ cx(
                        css.taskBar,
                        css[`taskBarStatus${statusTags[task.status] ?? 'None'}`],
                        isMissingDeadline ? css.taskBarWithMissingDeadline : css.taskBarOnTime,
                    ) }
                >
                    { positionConfig.taskBarWidth > 50 && (
                        <Text
                            color={ !task.status || task.status === '1' ? 'secondary' : 'white' }
                            cx={ css.assingeeText }
                        >
                            { task.name }
                        </Text>
                    ) }
                </div>
                <div
                    className={ classNames(css.taskBar, css.taskBarDeadline) }
                    style={ { width: `${deadlineWidth}px` } }
                >
                </div>
            </div>
        </Tooltip>
    );
}
