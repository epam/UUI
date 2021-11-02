import * as React from 'react';
import cx from 'classnames';
import * as css from './Table.scss';

export class TableRow extends React.Component<any> {

    isHeaderRow = () => {
        return this.props.node.nodes.toArray()[0].type === 'table_header_cell';
    }
    render() {
        const { attributes, children } = this.props;
        return <tr className={ cx(css.row, this.isHeaderRow() && css.headerRow) } { ...attributes }>{ children }</tr>;
    }
}