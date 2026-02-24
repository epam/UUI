import React, { useState } from 'react';
import { FlexRow, Text, Tooltip, Switch, FlexCell, Button } from '@epam/uui';

export default function WithFocusableElementsExample() {
    const [switchValue, setSwitchValue] = useState(false);

    return (
        <FlexRow columnGap="36" alignItems="center">
            <FlexRow>
                <FlexCell width="auto">
                    <FlexRow alignItems="center">
                        <Text fontSize="14">Tooltip on a focusable element</Text>
                    </FlexRow>

                    <FlexCell width="auto">
                        <FlexRow padding="12">
                            <Tooltip content="Switch">
                                <Switch
                                    label="Focusable Switch"
                                    value={ switchValue }
                                    onValueChange={ setSwitchValue }
                                />
                            </Tooltip>
                        </FlexRow>
                        <FlexRow padding="12">
                            <Tooltip content="Button">
                                <Button fill="outline" onClick={ () => null } caption="Button" />
                            </Tooltip>
                        </FlexRow>
                    </FlexCell>
                </FlexCell>
            </FlexRow>
            <FlexRow>
                <Tooltip content="Wrapper with focusable children">
                    <FlexCell width="auto">
                        <FlexRow alignItems="center">
                            <Text fontSize="14">Tooltip on a wrapper with focusable children</Text>
                        </FlexRow>

                        <FlexRow padding="12">
                            <Switch
                                label="Focusable Switch"
                                value={ switchValue }
                                onValueChange={ setSwitchValue }
                            />
                        </FlexRow>
                        <FlexRow padding="12">
                            <Switch
                                label="Disabled Switch"
                                value={ switchValue }
                                onValueChange={ setSwitchValue }
                                isDisabled={ true }
                            />
                        </FlexRow>
                        <FlexRow padding="12">
                            <Button fill="outline" onClick={ () => null } caption="Button" />
                        </FlexRow>
                    </FlexCell>
                </Tooltip>
            </FlexRow>
        </FlexRow>
    );
}
