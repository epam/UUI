import React, { useState } from 'react';
import { FlexCell, LabeledInput, NumericInput } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState<number>();

    return (
        <FlexCell width="auto" cx={ css.container }>
            <LabeledInput label="Default settings">
                <NumericInput value={ value } onValueChange={ onValueChange } />
            </LabeledInput>
            <LabeledInput label="With placeholder">
                <NumericInput placeholder="Amount" value={ value } onValueChange={ onValueChange } />
            </LabeledInput>
            <LabeledInput label="Step = 10, Min = -100, Max = 100">
                <NumericInput step={ 10 } value={ value } onValueChange={ onValueChange } min={ -100 } max={ 100 } />
            </LabeledInput>
            <LabeledInput label="isDisabled">
                <NumericInput value={ value } onValueChange={ onValueChange } isDisabled />
            </LabeledInput>
            <LabeledInput label="isReadonly">
                <NumericInput value={ value } onValueChange={ onValueChange } isReadonly />
            </LabeledInput>
        </FlexCell>
    );
}
