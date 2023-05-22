import * as React from 'react';
import css from './Table.module.scss';
import cx from 'classnames';
import { TableCellRenderer } from './TableCellRenderer';

export function TableHeaderCell(props: any) {
    const { attributes, element } = props;

    const appliedSpans = {
        colSpan: element?.data?.colSpan || Number(element.attributes?.colspan) || 1,
        rowSpan: element?.data?.rowSpan || Number(element.attributes?.rowspan) || 1,
    };
    // needs for getColIndex function
    // TODO: think about, should we store colSpan in element
    element.colSpan = appliedSpans.colSpan;

    if (!props.editor) {
        return null;
    }

    const cellStyles = { backgroundColor: 'inherit' };
    return (
        <TableCellRenderer
            isHeader
            { ...props }
            className={ cx(css.headerCell) }
            { ...attributes }
            nodeProps={ appliedSpans }
            style={ element?.data?.style === 'none' ? { display: 'none' } : cellStyles }
        />
    );
}
