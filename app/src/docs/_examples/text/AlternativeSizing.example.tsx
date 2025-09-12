import React from 'react';
import { Text } from '@epam/uui';

export default function AlternativeSizingExample() {
    return (
        <div>
            <Text size="none" fontSize={ 24 } lineHeight={ 30 }>
                Example of text with 30px line-height and 24px font-size
            </Text>
            <Text size="none" fontSize={ 16 } lineHeight={ 24 }>
                Example of text with 24px line-height and 16px font-size
            </Text>
            <Text size="none" fontSize={ 14 } lineHeight={ 16 }>
                Example of text with 16px line-height and 14x font-size
            </Text>
        </div>
    );
}
