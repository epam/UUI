import * as React from 'react';
import css from './Table.module.scss';
import cx from 'classnames';
import { TableCellRenderer } from './TableCellRenderer';

export function TableHeaderCell(props: any) {
    const { attributes, element } = props;

    const attrColSpan = isNaN(element.attributes?.colspan) ? 1 : Number(element.attributes?.colspan);
    const attrRowSpan = isNaN(element.attributes?.rowspan) ? 1 : Number(element.attributes?.rowspan);

    const appliedSpans = {
        colSpan: element?.data?.colSpan ?? attrColSpan,
        rowSpan: element?.data?.rowSpan ?? attrRowSpan,
    };
    // TODO: think about, should we store colSpan in element
    element.colSpan = appliedSpans.colSpan;

    if (!props.editor || element?.data?.merged) {
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
