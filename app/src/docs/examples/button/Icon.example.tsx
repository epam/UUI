import * as React from 'react';
import { Button } from '@epam/promo';
import * as myIcon from '@epam/assets/icons/common/action-eye-18.svg';

export function ButtonWithIconExample() {
    return (
        <>
            <Button icon={ myIcon } caption='View' onClick={ () => null } />
            <Button icon={ myIcon } iconPosition='right' caption='View' onClick={ () => null } />
            <Button icon={ myIcon } iconPosition='right' caption='View' fill='light' onClick={ () => null } />
            <Button icon={ myIcon } onClick={ () => null } />
            <Button icon={ myIcon } fill='light' onClick={ () => null } />
        </>
    );
}