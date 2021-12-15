import * as React from 'react';
import * as css from './Table.scss';
import { cx } from '@epam/uui';

export class TableRow extends React.Component<any> {

    isHeaderRow = () => {
        return this.props.node.nodes.toArray()[0].type === 'table_header_cell';
    }
    render() {
        const { attributes, children } = this.props;
        return <tr className={ cx(css.row, this.isHeaderRow() && css.headerRow) } { ...attributes }>{ children }</tr>;
    }
}