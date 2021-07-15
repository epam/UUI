import React from 'react';
import { Badge } from '@epam/promo';

export default function BasicExample() {
    return (
        <>
            <Badge color='blue' fill='solid' caption='Status' />
            <Badge color='blue' fill='semitransparent' caption='Status' />
            <Badge color='blue' fill='transparent' caption='Status' />
        </>
    );
}