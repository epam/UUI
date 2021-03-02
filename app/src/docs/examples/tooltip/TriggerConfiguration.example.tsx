import React from 'react';
import { Button, FlexRow, Tooltip } from '@epam/promo';

export function TriggerConfigurationExample() {
    return (
        <FlexRow spacing='12' >
            <Tooltip trigger='hover' content='Some text'>
                <Button caption='Hover' onClick={ () => null } />
            </Tooltip>

            <Tooltip trigger='click' content='Some text' placement='bottom' >
                <Button caption='Click' onClick={ () => null } />
            </Tooltip>

            <Tooltip trigger='press' content='Some text' placement='right' >
                <Button caption='Press' onClick={ () => null } />
            </Tooltip>
        </FlexRow>
    );
}