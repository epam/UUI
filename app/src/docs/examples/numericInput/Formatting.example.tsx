import React, { useState } from 'react';
import { FlexCell, LabeledInput, NumericInput } from '@epam/promo';
import css from './BasicExample.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(100500.123);

    return (
        <FlexCell width='auto' cx={ css.container } >
            <LabeledInput label='Default locale formatting'>
                <NumericInput
                    value={ value }
                    onValueChange={ onValueChange }
                />
            </LabeledInput>
            <LabeledInput label='With disableLocaleFormatting'>
                <NumericInput
                    value={ value }
                    onValueChange={ onValueChange }
                    disableLocaleFormatting={ true }
                />
            </LabeledInput>
            <LabeledInput label='No fraction digits'>
                <NumericInput
                    value={ value }
                    onValueChange={ onValueChange }
                    formatOptions={{ maximumFractionDigits: 0 }}
                />
            </LabeledInput>
            <LabeledInput label='Max 2 fractional digits'>
                <NumericInput
                    value={ value }
                    onValueChange={ onValueChange }
                    formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                />
            </LabeledInput>
            <LabeledInput label='Exactly 2 fractional digits'>
                <NumericInput
                    value={ value }
                    onValueChange={ onValueChange }
                    formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                />
            </LabeledInput>
            <LabeledInput label='Currency'>
                <NumericInput
                    value={ value }
                    onValueChange={ onValueChange }
                    formatOptions={{ style: "currency", currency: "USD", currencyDisplay: "name" }}
                />
            </LabeledInput>
            <LabeledInput label='Units (meters)'>
                <NumericInput
                    value={ value }
                    onValueChange={ onValueChange }
                    formatOptions={{ style: "unit", unit: "meter" }}
                />
            </LabeledInput>
        </FlexCell>
    );
}
