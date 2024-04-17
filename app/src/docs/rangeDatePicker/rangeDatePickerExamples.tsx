import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Day, DayProps } from '@epam/uui-components';
import { cx } from '@epam/uui-core';
import { IPropSamplesCreationContext } from '@epam/uui-docs';
import {
    Text, RangeDatePickerProps, RangeDatePickerValue, rangeDatePickerPresets,
    uuiRangeDatePickerBody,
} from '@epam/uui';
import css from './rangeDatePickerExamples.module.scss';
import isBetween from 'dayjs/plugin/isBetween.js';

dayjs.extend(isBetween);

export const getPlaceholderExamples = () => {
    return [
        {
            name: 'Custom placeholder',
            value: (type: 'from' | 'to') => {
                if (type === 'from') {
                    return 'Enter start day';
                } else if (type === 'to') {
                    return 'Enter end day';
                }
                return null;
            },
        },
    ];
};
export const filterExamples = () => {
    return [
        {
            name: 'Filter before current day and after 2 months',
            value: (day: Dayjs) => day.valueOf() >= dayjs().subtract(1, 'day').valueOf() && day.valueOf() < dayjs().add(2, 'months').valueOf(),
        },
    ];
};
export const presetsExamples = () => [
    {
        name: 'default',
        value: rangeDatePickerPresets,
    },
    {
        name: 'custom',
        value: {
            ...rangeDatePickerPresets,
            lastMonth: null,
            last3Days: {
                name: 'Last 3 days (custom)',
                getRange: () => {
                    return {
                        from: dayjs().subtract(2, 'day').toString(),
                        to: dayjs().toString(),
                        order: 11,
                    };
                },
            },
        },
    },
];

export const renderFooterExamples = () => {
    const getRangeLength = (value: RangeDatePickerValue) => {
        const isOneOrZero = dayjs(value.from).valueOf() === dayjs(value.to).valueOf() ? 1 : 0;

        return dayjs(value.to).isValid() && dayjs(value.from).isValid() && dayjs(value.from).valueOf() < dayjs(value.to).valueOf()
            ? dayjs(value.to).diff(dayjs(value.from), 'day') + 1
            : isOneOrZero;
    };
    return [
        {
            name: 'footer',
            value: (value: RangeDatePickerProps['value']) => (
                <div className={ css.container }>
                    <Text size="30">
                        { (!value?.from || !value?.to) && 'Please select range' }
                        { value?.from && value?.to && dayjs(value?.from).format('MMMM DD, YYYY') }
                        { (value?.from && value?.to) && ' - ' }
                        { value?.from && value?.to && dayjs(value?.to).format('MMMM DD, YYYY') }
                        { getRangeLength(value) !== 0 && (getRangeLength(value) === 1 ? ` (${getRangeLength(value)} day)` : ` (${getRangeLength(value)} days)`) }
                    </Text>
                </div>
            ),
        },
    ];
};

const format = 'DD/MM/YYYY';

export const renderDayExamples = (ctx: IPropSamplesCreationContext<RangeDatePickerProps>) => {
    return [
        {
            name: 'Render custom day',
            value: (renderProps: DayProps) => {
                const getCustomDay = (dayInner: Dayjs) => {
                    return (
                        <>
                            {dayInner.format('D')}
                            <div className={ css.dot } />
                        </>
                    );
                };

                const from = dayjs(ctx.getSelectedProps().value.from).format(format);
                const to = dayjs(ctx.getSelectedProps().value.to).format(format);
                const formattedValue = renderProps.value.format(format);

                const inRange = ctx.getSelectedProps().value
                && renderProps.value.isBetween(
                    ctx.getSelectedProps().value.from,
                    ctx.getSelectedProps().value.to,
                    undefined,
                    '[]',
                );

                const isFirst = formattedValue === from;
                const isLast = formattedValue === to;

                return (
                    <Day
                        { ...renderProps }
                        renderDayNumber={ getCustomDay }
                        isSelected={
                            formattedValue && from && to && (isFirst || isLast)
                        }
                        cx={ cx(
                            renderProps.cx,
                            inRange && uuiRangeDatePickerBody.inRange,
                            isFirst && uuiRangeDatePickerBody.firstDayInRangeWrapper,
                            isLast && uuiRangeDatePickerBody.lastDayInRangeWrapper,
                        ) }
                        filter={ ctx.getSelectedProps().filter }
                    />
                );
            },
        },
    ];
};
