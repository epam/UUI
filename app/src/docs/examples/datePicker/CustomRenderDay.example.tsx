import React, { useState } from 'react';
import { DatePicker, FlexRow } from '@epam/promo';
import moment from "moment";
import { IconContainer, Day } from "@epam/uui-components";
import * as point from "../../../icons/radio-point.svg";

const getCustomDay = (day: moment.Moment) => {
    return <>
        { day.format('D') }
        { day.format('E') === '7' && <IconContainer style={ { fill: '#fcaa00', height: '4px', width: '4px', position: "absolute", top: '7px', right: '10px' } }  icon={ point } /> }
    </>;
};

export const DatePickerCustomDayExample = () => {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow>
            <DatePicker
                value={ value }
                onValueChange={ onValueChange }
                format='MMM D, YYYY'
                renderDay={ (day: moment.Moment, onDayClick: (day: moment.Moment) => void) => {
                    return <Day renderDayNumber={ getCustomDay } value={ day } onValueChange={ onDayClick } isSelected={ day && day.isSame(value) } />;
                } }
            />
        </FlexRow>
    );
};