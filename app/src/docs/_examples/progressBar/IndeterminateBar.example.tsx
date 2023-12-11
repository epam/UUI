import React from 'react';
import { IndeterminateBar, Panel } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function CustomLabelProgressBarExample() {
    return (
        <Panel background="surface-main" style={ { flexBasis: '100%' } } cx={ css.root }>
            <IndeterminateBar />
            <IndeterminateBar size="18" />
            <IndeterminateBar size="24" />
        </Panel>
    );
}
