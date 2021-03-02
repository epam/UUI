import * as React from 'react';
import { Button } from '@epam/promo';

export function BasicExample() {
    return (
        <>
            <Button color='blue' caption='Primary Action' onClick={ () => null } />
            <Button color='green' caption='Call to action' onClick={ () => null } />
            <Button color='red' caption='Negative Action' onClick={ () => null } />
        </>
    );
}