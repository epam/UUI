import * as React from 'react';
import { DemoComponentProps } from '../types';
import { FlexRow, Panel } from '@epam/uui';

export function TabButtonContext(contextProps: DemoComponentProps) {
    const { DemoComponent, props } = contextProps;

    return (
        <Panel background="surface-main" margin="24" style={ { padding: '6px' } }>
            <FlexRow borderBottom size="36">
                <DemoComponent { ...props } />
            </FlexRow>
        </Panel>
    );
}

TabButtonContext.displayName = 'TabButtonContext';
