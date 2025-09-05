import React from 'react';
import { ScrollBars, Panel, Text, FlexRow } from '@epam/uui';

export default function BasicScrollBarsExample() {
    return (
        <Panel background="surface-main" shadow style={ { width: '600px', height: '400px' } }>
            <FlexRow borderBottom padding="24">
                <Text fontWeight="600">
                    Title
                </Text>
            </FlexRow>
            <ScrollBars>
                {Array.from({ length: 20 }, (_, index) => (
                    <FlexRow key={ index } padding="24">
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            This is item
                            {' '}
                            {index + 1}
                            {' '}
                            of many items to demonstrate scrolling behavior.
                        </Text>
                    </FlexRow>
                ))}
            </ScrollBars>
        </Panel>
    );
}
