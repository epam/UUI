import cx from 'classnames';
import * as React from 'react';

import css from './NotePluginBlock.module.scss';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';

export function NotePluginBlock({ className, nodeProps, ...rest }: PlateElementProps) {
    return (
        <PlateElement
            as="div"
            { ...rest }
            style={ {
                ...(nodeProps && {
                    borderColor: nodeProps.borderColor,
                    backgroundColor: nodeProps.backgroundColor,
                }),
            } }
            className={ cx(className, css.wrapper) }
        />
    );
}
