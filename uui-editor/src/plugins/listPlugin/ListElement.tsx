import React from 'react';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import { ELEMENT_OL_CUSTOM } from './constants';
import cx from 'classnames';
import css from './ListElement.module.scss';

interface ListElementProps extends PlateElementProps {
    variant: 'ul' | 'ol';
}

export function ListElement({
    className,
    children,
    ...props
}: ListElementProps) {
    const Element = props.element.type === ELEMENT_OL_CUSTOM ? 'ol' : 'ul';

    return (
        <PlateElement
            asChild
            className={ cx(css.list, className) }
            { ...props }
        >
            <Element>{children}</Element>
        </PlateElement>
    );
}
