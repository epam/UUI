import React, { useState } from 'react';
import { ScrollBars, Panel, Text, FlexRow, Checkbox, LabeledInput, NumericInput, FlexCell } from '@epam/uui';

export default function ScrollBarsAutohideConfigurationExample() {
    const [autoHide, setAutoHide] = useState(true);
    const [autoHideTimeout, setAutoHideTimeout] = useState(1000);

    return (
        <Panel background="surface-main" shadow style={ { width: '600px', height: '400px' } }>
            <FlexRow padding="24" borderBottom>
                <Text fontWeight="600">
                    Title
                </Text>
            </FlexRow>

            <FlexRow padding="24" vPadding="24" columnGap="24" borderBottom>
                <FlexCell width="auto">
                    <Checkbox
                        label="Auto Hide"
                        value={ autoHide }
                        onValueChange={ setAutoHide }
                    />
                    <LabeledInput label="Auto Hide Timeout (ms)">
                        <NumericInput
                            value={ autoHideTimeout }
                            onValueChange={ setAutoHideTimeout }
                            min={ 0 }
                            max={ 5000 }
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>

            <ScrollBars
                autoHide={ autoHide }
                autoHideTimeout={ autoHideTimeout }
            >
                <FlexRow padding="24" rawProps={ { style: { flexDirection: 'column' } } }>
                    {Array.from({ length: 10 }, (_, index) => (
                        <Text key={ index }>
                            Configure the ScrollBars behavior using the controls above.
                            Item 
                            {' '}
                            {index + 1}
                            {' '}
                            - try different settings to see how they affect the scrollbars.
                        </Text>
                    ))}
                </FlexRow>
            </ScrollBars>
        </Panel>
    );
}
