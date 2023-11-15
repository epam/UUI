import React from 'react';
import { NumericInput } from '@epam/uui';
import { ISharedPropEditor } from '../../types';

export function NumEditor(props: ISharedPropEditor<number>) {
    return (
        <NumericInput
            { ...props }
            size="24"
            placeholder="Numeric value"
            min={ Number.MIN_SAFE_INTEGER }
            formatOptions={
                { maximumFractionDigits: 10 }
            }
        />
    );
}
