import React from 'react';
import { Text } from '@epam/uui';

export default function BasicExample() {
    return (
        <div>
            <Text>Simple default text string</Text>
            <Text fontSize="24" lineHeight="30" color="primary">
                Text with set color, font, line-height and font-size
            </Text>
        </div>
    );
}
