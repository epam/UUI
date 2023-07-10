import cx from 'classnames';
import * as React from 'react';

import { TElement, createComponentAs, createElementAs, useElementProps } from '@udecode/plate-common';
import { TableRowElementRootProps } from '@udecode/plate-table';
import css from './Table.module.scss';

const DEFAULT_HEADER_ROW_HEIGHT = 46;
const DEFAULT_HEIGHT = 50;

export const TableRowElementRoot = createComponentAs<TableRowElementRootProps>(
    (props) => createElementAs('tr', useElementProps<TElement, 'tr'>(props))
);

export function TableRow(props: any) {
    const { attributes, children, element } = props;

    const isHeaderRow = () => {
        return element.children[0]?.type === 'table_header_cell';
    };

    if (!element.size) {
        if (isHeaderRow()) {
            element.size = DEFAULT_HEADER_ROW_HEIGHT;
        } else {
            element.size = DEFAULT_HEIGHT;
        }
    }

    return (
        <TableRowElementRoot
            { ...attributes }
            { ...props }
            className={ cx(css.row, isHeaderRow() && css.headerRow) }>
            { children }
        </TableRowElementRoot>
    );
}
