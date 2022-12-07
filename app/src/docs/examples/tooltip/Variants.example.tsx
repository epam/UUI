import React from 'react';
import { Button, FlexRow, Tooltip } from '@epam/promo';

export default function VariantsTooltipExample() {
    return (
        <FlexRow spacing='12' >
            <Tooltip content='Tooltip message' placement='bottom' >
                <Button caption='Contrast' color='blue' onClick={ () => null } />
            </Tooltip>

            <Tooltip content='Tooltip message' placement='bottom' color='white'>
                <Button caption='Default' fill='white' color='gray50' onClick={ () => null } />
            </Tooltip>

            <Tooltip content='Tooltip message' placement='bottom' color='red'>
                <Button caption='Critical' fill='white' color='red' onClick={ () => null } />
            </Tooltip>
        </FlexRow>
    );
}