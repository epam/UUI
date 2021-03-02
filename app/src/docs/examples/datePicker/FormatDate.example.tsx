import React, { useState } from 'react';
import moment from "moment";
import { DatePicker, FlexRow, LinkButton } from '@epam/promo';
import * as css from './FormatDateExample.scss';

export const DatePickerFormatDateExample = () => {
    const [value, onValueChange] = useState('');

    return (
        <>
            <DatePicker
                value={ value } // value format 'YYYY-MM-DD'
                onValueChange={ onValueChange }
                format='DD/MM/YYYY' // displayed day format
                renderFooter={ () => <FlexRow cx={ css.footer } background='white' size='48'>
                    <LinkButton size='42' caption='Today' onClick={ () => onValueChange(moment().format('YYYY-MM-DD')) } />
                </FlexRow> }
            />
        </>
    );
};