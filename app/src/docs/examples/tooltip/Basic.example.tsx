import React from 'react';
import { Button, FlexRow, Tooltip } from '@epam/promo';

export function BasicTooltipExample() {
    return (
        <FlexRow spacing='12' >
            <Tooltip content='Some text'>
                <Button caption='Top' onClick={ () => null } />
            </Tooltip>

            <Tooltip content='Some text' placement='bottom' >
                <Button caption='Bottom' onClick={ () => null } />
            </Tooltip>

            <Tooltip content='Some text' placement='right' >
                <Button caption='Right' onClick={ () => null } />
            </Tooltip>

            <Tooltip content='Some text' placement='left' >
                <Button caption='Left' onClick={ () => null } />
            </Tooltip>
        </FlexRow>
    );
}