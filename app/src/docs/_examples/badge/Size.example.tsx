import React from 'react';
import { Text, Badge } from '@epam/uui';
import css from './SizeExample.module.scss';

export default function SizeExample() {
    return (
        <div className={ css.container }>
            <div className={ css.badgeGroup }>
                <Badge size="42" color="info" fill="solid" caption="Badge" />
                <Text fontSize="14">42 px</Text>
            </div>
            <div className={ css.badgeGroup }>
                <Badge size="36" color="info" fill="solid" caption="Badge" />
                <Text fontSize="14">36 px</Text>
            </div>
            <div className={ css.badgeGroup }>
                <Badge size="30" color="info" fill="solid" caption="Badge" />
                <Text fontSize="14">30 px</Text>
            </div>
            <div className={ css.badgeGroup }>
                <Badge size="24" color="info" fill="solid" caption="Badge" />
                <Text fontSize="14">24 px</Text>
            </div>
            <div className={ css.badgeGroup }>
                <Badge size="18" color="info" fill="solid" caption="Badge" />
                <Text fontSize="14">18 px</Text>
            </div>
        </div>
    );
}
