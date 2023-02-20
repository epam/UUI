import React, { useState } from 'react';
import { RangeDatePicker, FlexRow, Text } from '@epam/promo';
import { rangeDatePickerPresets, RangeDatePickerValue } from '@epam/uui-components';
import dayjs from 'dayjs';
import css from './PresetsAndFooter.scss';

export default function DatePickerBaseExample() {
    const [value, onValueChange] = useState({ from: null, to: null });

    return (
        <FlexRow>
            <RangeDatePicker
                value={value}
                onValueChange={onValueChange}
                format="MMM D, YYYY"
                presets={{
                    ...rangeDatePickerPresets,
                    last3Days: {
                        name: 'Last 3 days',
                        getRange: () => {
                            return { from: dayjs().subtract(3, 'day').toString(), to: dayjs().toString(), order: 11 };
                        },
                    },
                    last7Days: {
                        name: 'Last 7 days',
                        getRange: () => {
                            return { from: dayjs().subtract(7, 'day').toString(), to: dayjs().toString(), order: 12 };
                        },
                    },
                }}
                renderFooter={(value: RangeDatePickerValue) => (
                    <div className={css.container}>
                        <FlexRow padding="24">
                            <Text>Range days count: {getRangeLength(value)}</Text>
                        </FlexRow>
                    </div>
                )}
            />
        </FlexRow>
    );
}

const getRangeLength = (value: RangeDatePickerValue) => {
    return dayjs(value.to).isValid() && dayjs(value.from).isValid() && dayjs(value.from).valueOf() < dayjs(value.to).valueOf()
        ? dayjs(value.to).diff(dayjs(value.from), 'day') + 1
        : 0;
};
