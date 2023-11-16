import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Day, IconContainer } from '@epam/uui-components';
import { IPropSamplesCreationContext } from '@epam/uui-docs';
import { Text, RangeDatePickerProps, RangeDatePickerValue, rangeDatePickerPresets } from '@epam/uui';
import { ReactComponent as Point } from '@epam/assets/icons/common/radio-point-10.svg';
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
    { name: 'default', value: rangeDatePickerPresets },
    {
        name: 'custom',
        value: {
            ...rangeDatePickerPresets,
            lastMonth: null,
            last3Days: {
                name: 'Last 3 days (custom)',
                getRange: () => {
                    return { from: dayjs().subtract(2, 'day').toString(), to: dayjs().toString(), order: 11 };
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

export const renderDayExamples = (ctx: IPropSamplesCreationContext<RangeDatePickerProps>) => {
    return [
        {
            name: 'Render custom day',
            value: (day: Dayjs, onDayClick: (day: Dayjs) => void) => {
                const getCustomDay = (dayInner: Dayjs) => {
                    return (
                        <>
                            {dayInner.format('D')}
                            <IconContainer
                                style={ {
                                    fill: '#fcaa00', height: '4px', width: '4px', position: 'absolute', top: '7px', right: '10px',
                                } }
                                icon={ Point }
                            />
                        </>
                    );
                };
                return (
                    <Day
                        renderDayNumber={ getCustomDay }
                        value={ day }
                        onValueChange={ onDayClick }
                        isSelected={
                            day && ctx.getSelectedProps().value && day.isBetween(ctx.getSelectedProps().value.from, ctx.getSelectedProps().value.to, undefined, '[]')
                        }
                        filter={ ctx.getSelectedProps().filter }
                    />
                );
            },
        },
    ];
};
