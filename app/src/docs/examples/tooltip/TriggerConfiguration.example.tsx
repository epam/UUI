import React from 'react';
import { Button, FlexRow, Tooltip } from '@epam/promo';

export default function TriggerConfigurationExample() {
    return (
        <FlexRow spacing='12' >
            <Tooltip content='Instant appearance'>
                <Button caption='Instant appearance' onClick={ () => null } />
            </Tooltip>

            <Tooltip content='0.5s delay' delay={ 0.5 } >
                <Button caption='0.5s delay' onClick={ () => null } />
            </Tooltip>

            <Tooltip content='0.1s delay' delay={ 0.1 } >
                <Button caption='0.1s delay' onClick={ () => null } />
            </Tooltip>

            <Tooltip trigger='click' content='Click' >
                <Button caption='Click' onClick={ () => null } />
            </Tooltip>
        </FlexRow>
    );
}