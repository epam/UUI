import React from 'react';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import cx from 'classnames';
import css from './TableRow.module.scss';

export interface PlateTableRowElementProps extends PlateElementProps, React.RefAttributes<React.ElementRef<typeof PlateElement>> {
    hideBorder?: boolean;
}

function TableRowElement({ hideBorder, children, ...props }: PlateTableRowElementProps) {
    return (
        <PlateElement
            asChild
            ref={ props.ref }
            className={ cx(css.row, hideBorder && css.hideBorder) }
            { ...props }
        >
            <tr>{ children }</tr>
        </PlateElement>
    );
}

TableRowElement.displayName = 'TableRowElement';

export { TableRowElement };
