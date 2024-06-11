import * as React from 'react';
import { ILens } from '@epam/uui-core';
import { FlexCell, FlexRow, LabeledInput, MultiSwitch, RichTextView } from '@epam/uui';
import { PersonOtherInfo } from '../types';

const tShirtSizes = [
    { id: 1, caption: 'XS' },
    { id: 2, caption: 'S' },
    { id: 3, caption: 'M' },
    { id: 4, caption: 'L' },
    { id: 5, caption: 'XL' },
];
export function OtherInfoSection({ lens }: { lens: ILens<PersonOtherInfo> }) {
    return (
        <>
            <RichTextView>
                <h3>Other Info</h3>
            </RichTextView>

            <FlexRow vPadding="12">
                <FlexCell width="auto">
                    <LabeledInput label="T-Shirt Size" { ...lens.prop('tShirtSize').toProps() }>
                        <MultiSwitch items={ tShirtSizes } { ...lens.prop('tShirtSize').toProps() } />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}
