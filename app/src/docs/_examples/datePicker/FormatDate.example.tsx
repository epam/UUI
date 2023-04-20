import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker, FlexRow, LinkButton } from '@epam/promo';
import css from './FormatDateExample.scss';

export default function DatePickerFormatDateExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow>
            <DatePicker
                value={ value } // value format 'YYYY-MM-DD'
                onValueChange={ onValueChange }
                format="DD/MM/YYYY" // displayed day format
                renderFooter={ () => (
                    <FlexRow cx={ css.footer } background="white" size="48">
                        <LinkButton size="42" caption="Today" onClick={ () => onValueChange(dayjs().format('YYYY-MM-DD')) } />
                    </FlexRow>
                ) }
            />
        </FlexRow>
    );
}
