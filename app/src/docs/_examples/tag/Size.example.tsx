import React from 'react';
import { FlexCell, FlexRow, Tag, TagProps } from '@epam/uui';
import css from './SizeExample.module.scss';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function SizeExample(props: ExampleProps) {
    const sizes = getAllPropValues('size', true, props) as TagProps['size'][];

    return (
        <FlexCell width="auto" cx={ css.container }>
            <FlexRow alignItems="top" columnGap="12">
                {
                    sizes.map((size) => (
                        <Tag key={ size } size={ size } caption={ `Size ${size}px` } />
                    ))
                }
            </FlexRow>
        </FlexCell>
    );
}
