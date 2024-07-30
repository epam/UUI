import * as React from 'react';
import { Button } from '@epam/uui';

export default function ButtonWithLink() {
    return (
        <div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
            <Button caption="SPA Link" link={ { pathname: '/' } } />
            <Button caption="Link outside" href="https://www.epam.com/" />
            <Button caption="Link outside in new tab" href="https://www.epam.com/" target="_blank" />
        </div>
    );
}
