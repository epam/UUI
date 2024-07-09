import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { TimelineTransform, TimelineController } from '@epam/uui-timeline';
import { Badge, FlexCell, FlexRow, Text, Tooltip } from '@epam/uui';
import { Task } from './types';
import { resources, statuses } from './demoData';
import { uuiDayjs } from '../../../helpers';

import css from './TaskBar.module.scss';

const getTaskColor = (status: string) => statuses.find((s) => s.id === status)?.color ?? '#e1e3eb';
const formatDate = (date: string) => {
    if (!date?.length) {
        return '';
    }
    return uuiDayjs.dayjs(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
};

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

    const status = statuses.find((s) => s.id === task.status);
    const renderTaskStatus = () => {
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
                            { formatDate(task.startDate) }
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
                                { formatDate(task.exactStartDate) }
                            </Text>
                        </FlexCell>
                    </FlexRow>
                )}
                { task.type === 'task'
                && (
                    <FlexRow columnGap="12" size="24" alignItems="center" justifyContent="start">
                        <FlexCell width="auto" minWidth={ 100 }>
                            <Text cx={ css.content } fontSize="12" lineHeight="18" fontWeight="600">
                                Due date:
                            </Text>
                        </FlexCell>
                        <FlexCell width="auto">
                            <Text cx={ css.content } fontSize="12" lineHeight="18">
                                { formatDate(task.dueDate) }
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
                            { task.type === 'story' ? formatDate(task.dueDate) : (to && uuiDayjs.dayjs(to).format('DD.MM.YYYY')) }
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
                style={ {
                    position: 'absolute' as any,
                    height: item.height ?? 18,
                    background: item.color,
                    width: `${coords.width}px`,
                    left: 0,
                    transform: `translateX(${coords.left}px)`,
                } }
            >
                { coords.width > 50 && <Text color="white" cx={ css.assingeeText }>{ task.name }</Text> }
            </div>
        </Tooltip>
    );
}
