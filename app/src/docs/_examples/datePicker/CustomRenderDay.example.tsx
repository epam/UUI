import React, { useState } from 'react';
import { Dayjs } from 'dayjs';
import { DatePicker, FlexRow } from '@epam/uui';
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
        <FlexRow rawProps={ { style: { minWidth: '195px' } } }>
            <DatePicker
                value={ value }
                onValueChange={ onValueChange }
                format="MMM D, YYYY"
                renderDay={ (renderProps) => {
                    return (
                        <Day
                            { ...renderProps }
                            renderDayNumber={ getCustomDay }
                            isSelected={ renderProps.value && renderProps.value.isSame(value) }
                        />
                    );
                } }
            />
        </FlexRow>
    );
}
