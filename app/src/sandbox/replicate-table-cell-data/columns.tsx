import React from "react";
import { DataColumnProps } from "@epam/uui-core";
import { DataTableCell, TextInput } from "@epam/promo";
import { DataItemExample, TableDataContextState } from "./table-data-context";
import { ReplicationMarker } from "./ReplicationMarker";
import { TableReplication } from "./Table";

export const COLUMN_IDS: (keyof DataItemExample)[] = ['column0', 'column1', 'column2', 'column3', 'column4'];

export const getColumns = (dataItem: DataItemExample, onChange: TableDataContextState[1]): DataColumnProps<DataItemExample>[] =>
    COLUMN_IDS.map((columnId, columnIndex) => ({
        key: columnId,
        render: (_, { index: rowIndex }) =>
            <TableReplication.ReplicationContainer
                columnIndex={ columnIndex }
                rowIndex={ rowIndex }
                rowId={ rowIndex }
                columnId={ columnId }
                render={ ({ targetParams, markerParams, valueToReplicate }) => {
                    const isColumn1 = columnId === 'column1';
                    const value = isColumn1 ? dataItem[columnId].value : dataItem[columnId];
                    return <div { ...targetParams }>
                        <TextInput
                            value={ markerParams?.isSelectedForReplication ? valueToReplicate : value }
                            onValueChange={ newValue => onChange(prevData =>
                                prevData.map((dataItem, i) =>
                                    i === rowIndex ? { ...dataItem, [columnId]: isColumn1 ? { value: newValue } : newValue } : dataItem))
                            }
                        />
                        <ReplicationMarker { ...markerParams } />
                    </div>;
                }
            }
        />,
        renderCell: props => <DataTableCell { ...props } padding="0"  />,
        width: 100,
    }));