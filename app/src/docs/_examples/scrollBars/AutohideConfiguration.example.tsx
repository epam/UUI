import React, { useState } from 'react';
import { ScrollBars, Panel, Text, FlexRow, Checkbox, LabeledInput, NumericInput, FlexCell } from '@epam/uui';

export default function ScrollBarsAutohideConfigurationExample() {
    const [autoHide, setAutoHide] = useState(true);
    const [autoHideDelay, setAutoHideDelay] = useState(1000);

    return (
        <Panel background="surface-main" shadow style={ { width: '600px' } }>
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
                    <LabeledInput label="Auto Hide Delay (ms)">
                        <NumericInput
                            value={ autoHideDelay }
                            onValueChange={ setAutoHideDelay }
                            min={ 0 }
                            max={ 5000 }
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>

            <ScrollBars
                autoHide={ autoHide }
                autoHideDelay={ autoHideDelay }
            >
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
        </Panel>
    );
}
