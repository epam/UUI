import * as React from 'react';
import css from './Table.scss';
import cx from 'classnames';
import { PlateTableCellElement } from '@udecode/plate';

export function TableHeaderCell(props: any) {
    const { attributes, node, element } = props;

    const cellStyles = { backgroundColor: 'inherit' }

    return <PlateTableCellElement
        { ...props }
        { ...attributes }
        colSpan={ node?.data?.get('colSpan') || 1 }
        rowSpan={ node?.data?.get('rowSpan') || 1 }
        nodeProps={ {
            colSpan: element?.data?.colSpan || 1,
            rowSpan: element?.data?.rowSpan || 1,
        } }
        className={ cx(css.cell, css.headerCell) }
        style={ element?.data?.style === 'none' ? { display: 'none' } : cellStyles }
    />
}
