import React from 'react';
import { ScrollBars, Panel, Text, FlexRow } from '@epam/uui';

export default function ScrollBarsWithShadowsExample() {
    return (
        <Panel background="surface-main" shadow style={ { width: '600px', height: '400px' } }>
            <FlexRow padding="24" borderBottom>
                <Text fontWeight="600">
                    Title
                </Text>
            </FlexRow>
            <ScrollBars
                hasTopShadow
                hasBottomShadow
                style={ {
                    '--uui-scroll-bars-shadow-top': 'linear-gradient(to bottom, var(--uui-divider-light) 0%, transparent 100%)',
                    '--uui-scroll-bars-shadow-bottom': 'linear-gradient(to top, var(--uui-divider-light) 0%, transparent 100%)',
                    '--uui-scroll-bars-shadow-height': '6px',
                } as React.CSSProperties }
            >
                <FlexRow padding="24" rawProps={ { style: { flexDirection: 'column' } } }>
                    {Array.from({ length: 15 }, (_, index) => (
                        <Text key={ index }>
                            Scroll to see shadows appear and disappear at the top and bottom edges.
                            Content item 
                            {' '}
                            {index + 1}
                            {' '}
                            - shadows help users understand there's more content above or below.
                        </Text>
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
