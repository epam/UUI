import cx from 'classnames';
import * as React from 'react';

import css from './NotePluginBlock.module.scss';
import { PlateElementProps, useElement } from '@udecode/plate-common';
import { NoteNodeProps } from './types';

export function NotePluginBlock({ attributes, children, nodeProps }: PlateElementProps) {
    const element = useElement();

    const type = element.type.replace('note-', '');

    let style;
    if (nodeProps) {
        const { borderColor, backgroundColor } = nodeProps as NoteNodeProps;
        style = {
            borderColor,
            backgroundColor,
        };
    }

    return (
        <div { ...attributes } style={ style } className={ cx(css.wrapper, css[type]) }>
            { children }
        </div>
    );
}
