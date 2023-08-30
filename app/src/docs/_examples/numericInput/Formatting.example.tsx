import React, { useState } from 'react';
import { FlexCell, LabeledInput, NumericInput } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicExample() {
    const [n1, setN1] = useState(1005001);
    const [n2, setN2] = useState(1005001);
    const [n3, setN3] = useState(1005001);
    const [n4, setN4] = useState(1005001.23);
    const [n5, setN5] = useState(1005001.23);
    const [n6, setN6] = useState(1005001.23);
    const [n7, setN7] = useState(1005001.23);
    const [n8, setN8] = useState(1005001.23);
    const [n9, setN9] = useState(1005001.23);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <LabeledInput label="Default locale formatting">
                <NumericInput value={ n1 } onValueChange={ (v) => setN1(v) } />
            </LabeledInput>
            <LabeledInput label="With disableLocaleFormatting">
                <NumericInput value={ n2 } onValueChange={ (v) => setN2(v) } disableLocaleFormatting />
            </LabeledInput>
            <LabeledInput label="No fraction digits">
                <NumericInput value={ n3 } onValueChange={ (v) => setN3(v) } formatOptions={ { maximumFractionDigits: 0 } } />
            </LabeledInput>
            <LabeledInput label="Min 2 fractional digits">
                <NumericInput value={ n4 } onValueChange={ (v) => setN4(v) } formatOptions={ { minimumFractionDigits: 2 } } />
            </LabeledInput>
            <LabeledInput label="Max 2 fractional digits">
                <NumericInput value={ n5 } onValueChange={ (v) => setN5(v) } formatOptions={ { maximumFractionDigits: 2 } } />
            </LabeledInput>
            <LabeledInput label="Exactly 2 fractional digits">
                <NumericInput
                    value={ n6 }
                    onValueChange={ (v) => setN6(v) }
                    formatOptions={ {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    } }
                />
            </LabeledInput>
            <LabeledInput label="Currency">
                <NumericInput
                    value={ n7 }
                    onValueChange={ (v) => setN7(v) }
                    formatOptions={ {
                        style: 'currency',
                        currency: 'USD',
                        currencyDisplay: 'name',
                    } }
                />
            </LabeledInput>
            <LabeledInput label="Custom formatting with max 2 fraction digits">
                <NumericInput value={ n8 } onValueChange={ (v) => setN8(v) } formatOptions={ { maximumFractionDigits: 2 } } formatValue={ (value) => 'USD ' + value } />
            </LabeledInput>
            <LabeledInput label="Units (meters)">
                <NumericInput value={ n9 } onValueChange={ (v) => setN9(v) } formatOptions={ { style: 'unit', unit: 'meter' } } />
            </LabeledInput>
        </FlexCell>
    );
}
