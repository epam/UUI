import React, { useState } from 'react';
import { rangeDatePickerPresets, RangeDatePickerValue, RangeDatePicker, FlexRow, Text } from '@epam/uui';
import { dayJsHelper } from '../../../helpers';
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
                            return { from: dayJsHelper.dayjs().subtract(2, 'day').toString(), to: dayJsHelper.dayjs().toString(), order: 11 };
                        },
                    },
                    last7Days: {
                        name: 'Last 7 days',
                        getRange: () => {
                            return { from: dayJsHelper.dayjs().subtract(6, 'day').toString(), to: dayJsHelper.dayjs().toString(), order: 12 };
                        },
                    },
                } }
                renderFooter={ (value: RangeDatePickerValue) => (
                    <div className={ css.container }>
                        <Text color="primary" size="30">
                            { (!value?.from || !value?.to) && 'Please select range' }
                            { value?.from && value?.to && dayJsHelper.dayjs(value?.from).format('MMMM DD, YYYY') }
                            { (value?.from && value?.to) && ' - ' }
                            { value?.from && value?.to && dayJsHelper.dayjs(value?.to).format('MMMM DD, YYYY') }
                            { getRangeLength(value) !== 0 && (getRangeLength(value) === 1 ? ` (${getRangeLength(value)} day)` : ` (${getRangeLength(value)} days)`) }
                        </Text>
                    </div>
                ) }
            />
        </FlexRow>
    );
}

const getRangeLength = (value: RangeDatePickerValue) => {
    const isOneOrZero = dayJsHelper.dayjs(value.from).valueOf() === dayJsHelper.dayjs(value.to).valueOf() ? 1 : 0;

    return (
        dayJsHelper.dayjs(value.to).isValid()
        && dayJsHelper.dayjs(value.from).isValid()
        && dayJsHelper.dayjs(value.from).valueOf() < dayJsHelper.dayjs(value.to).valueOf()
    )
        ? dayJsHelper.dayjs(value.to).diff(dayJsHelper.dayjs(value.from), 'day') + 1
        : isOneOrZero;
};
