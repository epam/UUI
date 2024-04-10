import React from 'react';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import cx from 'classnames';
import css from './TableRow.module.scss';

export interface PlateTableRowElementProps extends PlateElementProps {
    hideBorder?: boolean;
}

const TableRowElement = /* @__PURE__ */ React.forwardRef<
React.ElementRef<typeof PlateElement>,
PlateTableRowElementProps
>(({ hideBorder, children, ...props }, ref) => {
    return (
        <PlateElement
            asChild
            ref={ ref }
            className={ cx(css.row, hideBorder && css.hideBorder) }
            { ...props }
        >
            <tr>{ children }</tr>
        </PlateElement>
    );
});
TableRowElement.displayName = 'TableRowElement';

export { TableRowElement };
