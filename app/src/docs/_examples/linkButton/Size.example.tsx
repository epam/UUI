import React, { CSSProperties } from 'react';
import { LinkButton, LinkButtonProps, Text } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

import css from './SizeExample.module.scss';

export default function SizeExample(props: ExampleProps) {
    const sizes = getAllPropValues('size', true, props) as LinkButtonProps['size'][];

    return (
        <div className={ css.container } style={ { '--uui-example-repeat': sizes.length } as CSSProperties }>
            { sizes.map((size) =>
                (<LinkButton key={ size } caption="LINK BUTTON" link={ { pathname: '/' } } size={ size } />)) }
            { sizes.map((size) =>
                (<Text key={ `text-${size}` } fontSize="14">{ `${size} px` }</Text>)) }
        </div>
    );
}
