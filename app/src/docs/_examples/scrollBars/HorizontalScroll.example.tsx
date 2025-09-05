import React from 'react';
import { ScrollBars, Panel, Text, FlexRow } from '@epam/uui';

export default function HorizontalScrollExample() {
    return (
        <Panel background="surface-main" shadow style={ { width: '600px' } }>
            <FlexRow padding="24" borderBottom>
                <Text fontWeight="600">
                    Title
                </Text>
            </FlexRow>
            <ScrollBars autoHide>
                <FlexRow
                    padding="24"
                    vPadding="24"
                    columnGap={ 16 }
                    rawProps={ { style: { minWidth: '1200px' } } }
                >
                    {Array.from({ length: 10 }, (_, index) => (
                        <Panel
                            key={ index }
                            background="surface-main"
                            shadow
                            style={ {
                                width: '200px',
                                padding: '16px',
                            } }
                        >
                            <Text fontWeight="600">
                                Card
                                {index + 1}
                            </Text>
                            <Text fontSize="12" color="secondary">
                                This card demonstrates horizontal scrolling behavior.
                                Content that exceeds the container width will be scrollable.
                            </Text>
                        </Panel>
                    ))}
                </FlexRow>
            </ScrollBars>
            <FlexRow padding="24" borderTop>
                <Text fontSize="12" color="secondary">
                    Footer
                </Text>
            </FlexRow>
        </Panel>
    );
}
