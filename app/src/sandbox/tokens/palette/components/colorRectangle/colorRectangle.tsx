import React from 'react';
import css from './colorRectangle.module.scss';
import { Panel, Tag } from '@epam/uui';

export function ColorRectangle(props: { color: string, label: string }) {
    const style = {
        backgroundColor: `${props.color}`,
    };
    return (
        <Panel style={ style } cx={ [css.root] } shadow={ true }>
            &nbsp;
            <Tag color="neutral" caption={ props.label } size="18" fill="outline" cx={ css.label } />
        </Panel>
    );
}
