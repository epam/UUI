import * as React from 'react';
import { FlexCell, Text } from '@epam/promo';

export function BasicExample() {
    return (
        <div>
            <Text>Simple default text string</Text>
            <Text fontSize='24' lineHeight='30' color='gray90' font='museo-slab' >Text with set color, font, line-height and font-size</Text>
        </div>
    );
}