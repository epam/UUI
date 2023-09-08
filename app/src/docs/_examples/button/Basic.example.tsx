import React from 'react';
import { Button } from '@epam/uui';

export default function BasicExample() {
    return (
        <>
            <Button color="primary" caption="Primary Action" onClick={ () => null } />
            <Button color="accent" caption="Call to action" onClick={ () => null } />
            <Button color="critical" caption="Critical Action" onClick={ () => null } />
        </>
    );
}
