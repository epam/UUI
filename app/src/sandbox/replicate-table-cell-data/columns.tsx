import React, { FC } from "react";
import { DataColumnProps } from "@epam/uui-core";
import { DataTableCell, TextInput } from "@epam/promo";
import { DataItemExample } from "./table-data-context";
import { ReplicationMarker } from "./ReplicationMarker";
import { useReplication } from "./useReplication";

export const COLUMN_IDS: (keyof DataItemExample)[] = ['column0', 'column1', 'column2', 'column3', 'column4'];
export const COLUMNS_DATA_TYPES: string[] = ['text', 'percent', 'text', 'percent', 'text'];

interface CellProps {
    columnIndex: number;
    columnId: string;
    rowIndex: number;
    value: string;
}

const Cell1: FC<CellProps> = ({ columnIndex, columnId, rowIndex, value }) => {
    const { valueToReplicate, isSelectedForReplication, replicationContainerEventHandlers, replicationMarkerParams } =
        useReplication({ columnIndex, columnId, rowIndex, rowId: `${ rowIndex }`, value, dataType: COLUMNS_DATA_TYPES[columnIndex]});


    return <div { ...replicationContainerEventHandlers } style={ { userSelect: 'none', position: 'relative' } }>
        <TextInput value={ isSelectedForReplication ? valueToReplicate : value } onValueChange={ () => {} }/>
        <ReplicationMarker { ...replicationMarkerParams } />
    </div>;
};

export const columns1: DataColumnProps<DataItemExample>[] = COLUMN_IDS.map((columnId, columnIndex) => ({
    key: columnId,
    render: (item, { index: rowIndex }) =>
        <Cell1 columnIndex={ columnIndex } columnId={ columnId } rowIndex={ rowIndex } value={ item[columnId] } />,

    renderCell: props => <DataTableCell { ...props } padding="0"  />,
    width: 100,
}));

const Cell2: FC<CellProps> = ({ columnIndex, columnId, rowIndex, value }) => {
    const { valueToReplicate, isSelectedForReplication, replicationContainerEventHandlers, replicationMarkerParams } =
        useReplication({ columnIndex, columnId, rowIndex, rowId: `${ rowIndex }`, value });


    return <div { ...replicationContainerEventHandlers } style={ { userSelect: 'none', position: 'relative' } }>
        <TextInput value={ isSelectedForReplication ? valueToReplicate : value } onValueChange={ () => {} }/>
        <ReplicationMarker { ...replicationMarkerParams } />
    </div>;
};

export const columns2: DataColumnProps<DataItemExample>[] = COLUMN_IDS.map((columnId, columnIndex) => ({
    key: columnId,
    render: (item, { index: rowIndex }) =>
        <Cell2 columnIndex={ columnIndex } columnId={ columnId } rowIndex={ rowIndex } value={ item[columnId] } />,

    renderCell: props => <DataTableCell { ...props } padding="0"  />,
    width: 100,
}));