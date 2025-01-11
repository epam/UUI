import React from 'react';
import { Panel, Text, Badge, BadgeProps } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function ColorsExample(props: ExampleProps) {
    const colors = getAllPropValues('color', false, props) as BadgeProps['color'][];

    return (

        <Panel style={ { padding: '12px', flex: '1 1 0' } }>
            <Text fontSize="14">Semantic colors, use for appropriate sense</Text>
            <div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
                { colors.map((color) => (
                    <Badge
                        key={ color }
                        color={ color }
                        caption={ color.charAt(0).toUpperCase() + color.slice(1) }
                    />
                )) }
            </div>
        </Panel>
    );
}
