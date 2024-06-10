import React, { useState } from 'react';
import { FlexCell, FlexRow, LabeledInput, MultiSwitch, TextInput } from '@epam/uui';

type IDir = 'ltr' | 'rtl' | 'auto';

export function RtlExample() {
    const [value, setValue] = useState('');
    const [labelDir, setLabelDir] = useState<IDir>('ltr');
    const [inputDir, setInputDir] = useState<IDir>('ltr');
    return (
        <FlexCell grow={ 1 }>
            <FlexRow padding="24" vPadding="24" alignItems="top">
                <LabeledInput label="Label dir" labelPosition="top">
                    <MultiSwitch
                        value={ labelDir }
                        onValueChange={ setLabelDir }
                        items={ [{ id: 'ltr', caption: 'Ltr' }, { id: 'rtl', caption: 'Rtl' }, { id: 'auto', caption: 'Auto' }] }
                    />
                </LabeledInput>
                <LabeledInput label="Input dir" labelPosition="top">
                    <MultiSwitch
                        value={ inputDir }
                        onValueChange={ setInputDir }
                        items={ [{ id: 'ltr', caption: 'Ltr' }, { id: 'rtl', caption: 'Rtl' }, { id: 'auto', caption: 'Auto' }] }
                    />
                </LabeledInput>
            </FlexRow>
            <FlexRow padding="24" vPadding="24" alignItems="top">
                <FlexCell minWidth={ 324 }>
                    <LabeledInput label="Address" labelPosition="left" rawProps={ { dir: labelDir } }>
                        <TextInput
                            value={ value }
                            onValueChange={ setValue }
                            rawProps={ { dir: inputDir } }
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </FlexCell>
    );
}
