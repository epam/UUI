import React from 'react';
import { Text, Badge, BadgeProps } from '@epam/uui';
import { getAllPropValues } from '../utils';
import { ExampleProps } from '../types';

import css from './SizeExample.module.scss';

export default function SizeExample(props: ExampleProps) {
    const sizes = getAllPropValues('size', true, props) as Array<BadgeProps['size']>;

    return (
        <div className={ css.container }>
            {
                sizes?.map((size) => (
                    <div className={ css.badgeGroup }>
                        <Badge size={ size } color="info" fill="solid" caption="Badge" />
                        <Text>{`${size} px`}</Text>
                    </div>
                ))
            }
        </div>
    );
}
