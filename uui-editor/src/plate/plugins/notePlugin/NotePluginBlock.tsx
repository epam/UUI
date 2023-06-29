import * as React from 'react';
import cx from 'classnames';

import { StyledElementProps } from '@udecode/plate';

import css from './NotePluginBlock.module.scss';

interface NotePluginBlock extends StyledElementProps {
    type: string;
}

export function NotePluginBlock(props: NotePluginBlock) {

    const { attributes, type, children } = props;

    return (
        <div { ...attributes } className={ cx(css.wrapper, css[type]) }>
            <div className={ css.content }>
                { children }
            </div>
        </div>
    );
}
