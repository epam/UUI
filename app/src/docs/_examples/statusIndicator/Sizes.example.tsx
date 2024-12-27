import React from 'react';
import { FlexRow, StatusIndicator, StatusIndicatorProps } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function SizesStatusIndicatorExample(props: ExampleProps) {
    const sizes = getAllPropValues('size', true, props) as StatusIndicatorProps['size'][];
    return (
        <FlexRow columnGap="18">
            { sizes.map((size) => (
                <StatusIndicator key={ size } color="info" size={ size } caption={ `Size ${size}px` } />
            )) }
        </FlexRow>
    );
}
