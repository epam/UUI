import cx from 'classnames';
import * as React from 'react';

import css from './NotePluginBlock.module.scss';
import { PlateElementProps, useElement } from '@udecode/plate-common';
import { NoteNodeProps } from './types';

export function NotePluginBlock({ attributes, children, nodeProps }: PlateElementProps) {
    const element = useElement();

    const type = React.useMemo(() => element.type.replace('note-', ''), [element.type]);

    const style = React.useMemo(() => {
        if (nodeProps) {
            const { borderColor, backgroundColor } = nodeProps as NoteNodeProps;
            return {
                borderColor,
                backgroundColor,
            };
        }
    }, [nodeProps]);

    return (
        <div { ...attributes } style={ style } className={ cx(css.wrapper, css[type]) }>
            { children }
        </div>
    );
}
