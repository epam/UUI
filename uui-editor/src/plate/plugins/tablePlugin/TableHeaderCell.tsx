import * as React from 'react';
import css from './Table.scss';
import cx from 'classnames';

export function TableHeaderCell(props: any) {

    const { attributes, children, node } = props;

    // if (!this.props.editor) {
    //     return null;
    // }

    let isCellFocused = false; //selectedCells.includes(props.node.nodes.toArray()[0]) && selectedCells.length > 1;
    let cellStyles = {
        height: node?.data?.get('rowSpan') ?  `${24 * node.data.get('rowSpan')}px` : null,
        background: isCellFocused ? '#B3D7FF' : null,
    };

    return <th
        className={ cx(css.cell, css.tableHeader) }
        colSpan={ node?.data?.get('colSpan') || 1 }
        rowSpan={ node?.data?.get('rowSpan') || 1 }
        { ...attributes }
        style={ node?.data?.get('style') === 'none' ? { display: 'none' } : cellStyles }
    >
        { children }
        <div className={ cx(css.resizingBorder, 'uui-richTextEditor-resize-border') } />
    </th>;
}
