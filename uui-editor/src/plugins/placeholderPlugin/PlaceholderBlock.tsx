import * as React from 'react';
import css from './PlaceholderPlugin.module.scss';
import cx from 'classnames';
import { useSelected } from 'slate-react';
import { uuiMod } from '@epam/uui-core';
import { PlateElement, PlateElementProps, useElement } from '@udecode/plate-common';
import { TPlaceholderElement } from './types';

export function PlaceholderBlock({ className, children, ...props }: PlateElementProps) {
    const element = useElement<TPlaceholderElement>();
    const selected = useSelected();
    const src = element.data.name;

    return (
        <PlateElement
            as="span"
            className={ cx(className, css.placeholderBlock, selected && uuiMod.focus) }
            { ...props }
        >
            { src }
            { children }
        </PlateElement>
    );
}
