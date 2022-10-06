import * as React from 'react';
import * as css from './Divider.scss';

Divider.displayName = 'Divider';

export function Divider() {
    return (
        <div className={ css.divider } />
    );
}
