import React, { useState } from 'react';
import { Dayjs } from 'dayjs';
import { DatePicker, FlexRow } from '@epam/promo';
import { IconContainer, Day } from '@epam/uui-components';
import { ReactComponent as Point } from '@epam/assets/icons/common/radio-point-10.svg';

const getCustomDay = (day: Dayjs) => {
    return (
        <>
            {day.format('D')}
            {day.day() === 0 && (
                <IconContainer
                    style={ {
                        fill: '#fcaa00', height: '4px', width: '4px', position: 'absolute', top: '7px', right: '10px',
                    } }
                    icon={ Point }
                />
            )}
        </>
    );
};

export default function DatePickerCustomDayExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow>
            <DatePicker
                value={ value }
                onValueChange={ onValueChange }
                format="MMM D, YYYY"
                renderDay={ (day: Dayjs, onDayClick: (day: Dayjs) => void) => {
                    return <Day renderDayNumber={ getCustomDay } value={ day } onValueChange={ onDayClick } isSelected={ day && day.isSame(value) } />;
                } }
            />
        </FlexRow>
    );
}
