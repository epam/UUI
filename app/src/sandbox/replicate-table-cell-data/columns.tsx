import React, { FC } from "react";
import { DataColumnProps } from "@epam/uui-core";
import { DataTableCell, TextInput } from "@epam/promo";
import { DataItemExample } from "./table-data-context";
import { ReplicationMarker } from "./ReplicationMarker";
import { useReplication } from "./Table";

export const COLUMN_IDS: (keyof DataItemExample)[] = ['column0', 'column1', 'column2', 'column3', 'column4'];

interface CellProps {
    columnIndex: number;
    columnId: string;
    rowIndex: number;
    value: string;
}

const Cell: FC<CellProps> = ({ columnIndex, columnId, rowIndex, value }) => {
    const { replicationContainerEventHandlers, ReplicationMarker, valueToReplicate, isSelectedForReplication } =
        useReplication({ columnIndex, columnId, rowIndex, rowId: `${ rowIndex }`, value});

    return <div { ...replicationContainerEventHandlers } style={ { userSelect: 'none', position: 'relative' } }>
        <TextInput value={ isSelectedForReplication ? valueToReplicate : value } onValueChange={ () => {} }/>
        <ReplicationMarker />
    </div>;
};

export const columns: DataColumnProps<DataItemExample>[] = COLUMN_IDS.map((columnId, columnIndex) => ({
    key: columnId,
    render: (item, { index: rowIndex }) =>
        <Cell columnIndex={ columnIndex } columnId={ columnId } rowIndex={ rowIndex } value={ item[columnId] } />,

    renderCell: props => <DataTableCell { ...props } padding="0"  />,
    width: 100,
}));
