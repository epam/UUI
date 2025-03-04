import React from 'react';
import { StatusIndicatorProps, StatusIndicator, Text, FlexRow } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function BasicStatusIndicatorExample(props: ExampleProps) {
    const colors = getAllPropValues('color', false, props) as StatusIndicatorProps['color'][];

    return (
        <div style={ { overflow: 'hidden' } }>
            <FlexRow>
                <Text>Fill solid:</Text>
            </FlexRow>
            <FlexRow rawProps={ { style: { flexWrap: 'wrap' } } } columnGap="12" rowGap="12" alignItems="center">
                { colors.map((color) => (
                    <StatusIndicator
                        key={ color }
                        color={ color }
                        caption={ color.charAt(0).toUpperCase() + color.slice(1) }
                    />
                )) }
            </FlexRow>
            <FlexRow>
                <Text>Fill outline:</Text>
            </FlexRow>
            <FlexRow rawProps={ { style: { flexWrap: 'wrap' } } } columnGap="12" rowGap="12" alignItems="center">
                { colors.map((color) => (
                    <StatusIndicator
                        key={ color }
                        color={ color }
                        caption={ color.charAt(0).toUpperCase() + color.slice(1) }
                        fill="outline"
                    />
                )) }
            </FlexRow>
        </div>
    );
}
