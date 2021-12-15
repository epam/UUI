import * as React from 'react';
import * as css from './Table.scss';
import { Subscriber } from 'react-broadcast';
import { cx } from '@epam/uui';

export class TableHeaderCell extends React.Component<any> {

    render() {
        const { attributes, children, node } = this.props;

        if (!this.props.editor) {
            return null;
        }

        return (
            <Subscriber channel='uui-rte-table'>
                { (selectedCells: any) => {
                    let isCellFocused = selectedCells.includes(this.props.node.nodes.toArray()[0]) && selectedCells.length > 1;
                    let cellStyles = {
                        height: node.data.get('rowSpan') ?  `${24 * node.data.get('rowSpan')}px` : null,
                        background: isCellFocused ? '#B3D7FF' : null,
                    };

                    return <th className={ cx(css.cell, css.tableHeader) } colSpan={ node.data.get('colSpan') || 1 } rowSpan={ node.data.get('rowSpan') || 1 } { ...attributes } style={ node.data.get('style') === 'none' ? { display: 'none' } : cellStyles }>
                        { children }
                        <div className={ cx(css.resizingBorder, 'uui-richTextEditor-resize-border') } />
                    </th>;
                } }
            </Subscriber>
        );
    }
}
