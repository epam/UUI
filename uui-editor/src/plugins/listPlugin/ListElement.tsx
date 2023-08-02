import React from 'react';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';

interface ListElementProps extends PlateElementProps {
    variant: 'ul' | 'ol';
}

export function ListElement({
    className,
    children,
    variant = 'ul',
    ...props
}: ListElementProps) {
    const Element = variant!;

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
