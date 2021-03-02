import * as React from 'react';
import { Button, ControlGroup } from '@epam/promo';

export function BasicExample() {
    return (
        <>
            <ControlGroup>
                <Button color='green' caption='Submit' onClick={ () => null } />
                <Button caption='Help' onClick={ () => null } />
                <Button fill='none' color='gray50' caption='Cancel' onClick={ () => null } />
            </ControlGroup>
        </>
    );
}