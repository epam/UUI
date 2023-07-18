import React, { useState } from 'react';
import { DatePicker, FlexRow, LinkButton } from '@epam/promo';
import css from './FormatDateExample.module.scss';
import dayjs from 'dayjs';

export default function DatePickerFooterExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow>
            <DatePicker
                value={ value }
                onValueChange={ onValueChange }
                renderFooter={ () => (
                    <FlexRow cx={ css.footer } background="white" size="48">
                        <LinkButton size="36" caption="Today" onClick={ () => onValueChange(dayjs().format('YYYY-MM-DD')) } />
                    </FlexRow>
                ) }
            />
        </FlexRow>
    );
}
