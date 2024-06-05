import React from 'react';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import { OL_TYPE } from './constants';

interface ListElementProps extends PlateElementProps {
    variant: 'ul' | 'ol';
}

export function ListElement({
    className,
    children,
    ...props
}: ListElementProps) {
    const Element = props.element.type === OL_TYPE ? 'ol' : 'ul';

    return (
        <PlateElement
            asChild
            className={ className }
            { ...props }
        >
            <Element>{children}</Element>
        </PlateElement>
    );
}
