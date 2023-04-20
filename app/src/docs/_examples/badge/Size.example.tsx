import React from 'react';
import { Badge, Text } from '@epam/promo';
import css from './SizeExample.scss';

export default function SizeExample() {
    return (
        <div className={ css.container }>
            <Badge size="42" color="blue" fill="solid" caption="Badge" />
            <Badge size="36" color="blue" fill="solid" caption="Badge" />
            <Badge size="30" color="blue" fill="solid" caption="Badge" />
            <Badge size="24" color="blue" fill="solid" caption="Badge" />
            <Badge size="18" color="blue" fill="solid" caption="Badge" />
            <Text fontSize="14">42 px</Text>
            <Text fontSize="14">36 px</Text>
            <Text fontSize="14">30 px</Text>
            <Text fontSize="14">24 px</Text>
            <Text fontSize="14">18 px</Text>
        </div>
    );
}
