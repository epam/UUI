import React, { useState } from 'react';
import { rangeDatePickerPresets, RangeDatePicker, FlexRow, Text } from '@epam/uui';
import { RangeDatePickerValue } from '@epam/uui-core';
import dayjs from 'dayjs';
import css from './PresetsAndFooter.module.scss';

export default function DatePickerBaseExample() {
    const [pickerValue, onPickerValueChange] = useState({ from: null, to: null });

    return (
        <FlexRow>
            <RangeDatePicker
                value={ pickerValue }
                onValueChange={ onPickerValueChange }
                format="MMM D, YYYY"
                presets={ {
                    ...rangeDatePickerPresets,
                    last3Days: {
                        name: 'Last 3 days',
                        getRange: () => {
                            return { from: dayjs().subtract(2, 'day').toString(), to: dayjs().toString(), order: 11 };
                        },
                    },
                    last7Days: {
                        name: 'Last 7 days',
                        getRange: () => {
                            return { from: dayjs().subtract(6, 'day').toString(), to: dayjs().toString(), order: 12 };
                        },
                    },
                } }
                renderFooter={ (value: RangeDatePickerValue) => (
                    <div className={ css.container }>
                        <Text color="primary" size="30">
                            { (!value?.from || !value?.to) && 'Please select range' }
                            { value?.from && value?.to && dayjs(value?.from).format('MMMM DD, YYYY') }
                            { (value?.from && value?.to) && ' - ' }
                            { value?.from && value?.to && dayjs(value?.to).format('MMMM DD, YYYY') }
                            { getRangeLength(value) !== 0 && (getRangeLength(value) === 1 ? ` (${getRangeLength(value)} day)` : ` (${getRangeLength(value)} days)`) }
                        </Text>
                    </div>
                ) }
            />
        </FlexRow>
    );
}

const getRangeLength = (value: RangeDatePickerValue) => {
    const isOneOrZero = dayjs(value.from).valueOf() === dayjs(value.to).valueOf() ? 1 : 0;

    return (
        dayjs(value.to).isValid()
        && dayjs(value.from).isValid()
        && dayjs(value.from).valueOf() < dayjs(value.to).valueOf()
    )
        ? dayjs(value.to).diff(dayjs(value.from), 'day') + 1
        : isOneOrZero;
};
