import * as React from 'react';
import { uuiDayjs } from '../../helpers/dayJsHelper';
import type { Dayjs } from '../../helpers/dayJsHelper';
import { Day, DayProps } from '@epam/uui-components';
import { cx, RangeDatePickerValue } from '@epam/uui-core';
import { IPropSamplesCreationContext } from '../../';
import {
    Text, RangeDatePickerProps, rangeDatePickerPresets,
    uuiRangeDatePickerBody,
} from '@epam/uui';
import css from './rangeDatePickerExamples.module.scss';

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
            value: (day: Dayjs) => day.valueOf() >= uuiDayjs.dayjs().subtract(1, 'day').valueOf() && day.valueOf() < uuiDayjs.dayjs().add(2, 'months').valueOf(),
        },
    ];
};

const { lastMonth, ...rangeDatePickerPresetsNoLastMonth } = rangeDatePickerPresets;
export const presetsExamples = () => [
    {
        name: 'default',
        value: rangeDatePickerPresets,
    },
    {
        name: 'custom',
        value: {
            ...rangeDatePickerPresetsNoLastMonth,
            last3Days: {
                name: 'Last 3 days (custom)',
                getRange: () => {
                    return {
                        from: uuiDayjs.dayjs().subtract(2, 'day').toString(),
                        to: uuiDayjs.dayjs().toString(),
                        order: 11,
                    };
                },
            },
        },
    },
];

export const renderFooterExamples = () => {
    const getRangeLength = (value: RangeDatePickerValue) => {
        const isOneOrZero = uuiDayjs.dayjs(value.from).valueOf() === uuiDayjs.dayjs(value.to).valueOf() ? 1 : 0;

        return (
            uuiDayjs.dayjs(value.to).isValid()
            && uuiDayjs.dayjs(value.from).isValid()
            && uuiDayjs.dayjs(value.from).valueOf()
            < uuiDayjs.dayjs(value.to).valueOf()
        )
            ? uuiDayjs.dayjs(value.to).diff(uuiDayjs.dayjs(value.from), 'day') + 1
            : isOneOrZero;
    };
    return [
        {
            name: 'footer',
            value: (value: RangeDatePickerProps['value']) => (
                <div className={ css.container }>
                    <Text size="30">
                        { (!value?.from || !value?.to) && 'Please select range' }
                        { value?.from && value?.to && uuiDayjs.dayjs(value?.from).format('MMMM DD, YYYY') }
                        { (value?.from && value?.to) && ' - ' }
                        { value?.from && value?.to && uuiDayjs.dayjs(value?.to).format('MMMM DD, YYYY') }
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

                const from = uuiDayjs.dayjs(ctx.getSelectedProps().value.from).format(format);
                const to = uuiDayjs.dayjs(ctx.getSelectedProps().value.to).format(format);
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
