import React from 'react';
import { Button } from '@epam/uui';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-eye-18.svg';

export default function ButtonWithIconExample() {
    return (
        <div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
            <Button icon={ MyIcon } caption="View" onClick={ () => null } />
            <Button icon={ MyIcon } iconPosition="right" caption="View" onClick={ () => null } />
            <Button icon={ MyIcon } iconPosition="right" caption="View" fill="ghost" onClick={ () => null } />
            <Button icon={ MyIcon } onClick={ () => null } />
            <Button icon={ MyIcon } fill="ghost" onClick={ () => null } />
        </div>
    );
}
