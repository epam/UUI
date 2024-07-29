import React from 'react';
import { Button } from '@epam/uui';

export default function BasicExample() {
    return (
        <div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
            <Button color="primary" caption="Primary Action" onClick={ () => null } />
            <Button color="accent" caption="Call to action" onClick={ () => null } />
            <Button color="critical" caption="Critical Action" onClick={ () => null } />
        </div>
    );
}
