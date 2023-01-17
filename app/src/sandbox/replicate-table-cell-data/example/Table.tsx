import React, { FC, useCallback } from "react";
import { DataTableRow } from "@epam/uui-components";
import { useTableDataContext1, useTableDataContext2 } from "./table-data-context";
import { COLUMN_IDS, columns1, columns2 } from "./columns";
import { DataReplicationProvider, ReplicationHandler } from "../context/DataReplicationProvider";

export const Table1: FC = () => {
    const [data, setData] = useTableDataContext1();

    const handleReplicate = useCallback<ReplicationHandler>(({ startRowIndex, startColumnIndex, endRowIndex, endColumnIndex }, canReplicate) => {
        setData(data.map((item, rowIndex) => {
            const isRowInRange = (rowIndex <= endRowIndex && rowIndex >= startRowIndex) || (rowIndex <= startRowIndex && rowIndex >= endRowIndex);
            if (isRowInRange) {
                return COLUMN_IDS.reduce((result, current, columnIndex) => {
                    const nextResult = { ...result };
                    const isColumnInRange = (columnIndex <= endColumnIndex && columnIndex >= startColumnIndex) || (columnIndex <= startColumnIndex && columnIndex >= endColumnIndex);
                    const shouldReplicate = isColumnInRange && canReplicate(rowIndex, columnIndex);

                    if (shouldReplicate) {
                        nextResult[current] = data[startRowIndex][COLUMN_IDS[startColumnIndex]];
                    }

                    return nextResult;
                }, item);
            }

            return item;
        }));
    }, [setData, data]);

    return <DataReplicationProvider onReplicate={ handleReplicate } columnDataTypes={ ['number', 'number', 'number'] }>
        <div>
            { data.map((item, i) =>
                <DataTableRow key={ i } id={ i } rowKey={ `row${ i }` } index={ i } value={ item } columns={ columns1 } />)
            }
        </div>
    </DataReplicationProvider>;
};

export const Table2: FC = () => {
    const [data, setData] = useTableDataContext2();

    const handleReplicate = useCallback<ReplicationHandler>(({ startRowIndex, startColumnIndex, endRowIndex, endColumnIndex }, canReplicate) => {
        setData(data.map((item, rowIndex) => {
            const isRowInRange = (rowIndex <= endRowIndex && rowIndex >= startRowIndex) || (rowIndex <= startRowIndex && rowIndex >= endRowIndex);
            if (isRowInRange) {
                return COLUMN_IDS.reduce((result, current, columnIndex) => {
                    const nextResult = { ...result };
                    const isColumnInRange = (columnIndex <= endColumnIndex && columnIndex >= startColumnIndex) || (columnIndex <= startColumnIndex && columnIndex >= endColumnIndex);
                    const shouldReplicate = isColumnInRange && canReplicate(rowIndex, columnIndex);

                    if (shouldReplicate) {
                        nextResult[current] = data[startRowIndex][COLUMN_IDS[startColumnIndex]];
                    }

                    return nextResult;
                }, item);
            }

            return item;
        }));
    }, [setData, data]);

    return <DataReplicationProvider onReplicate={ handleReplicate }>
        <div>
            { data.map((item, i) =>
                <DataTableRow key={ i } id={ i } rowKey={ `row${ i }` } index={ i } value={ item } columns={ columns2 } />)
            }
        </div>
    </DataReplicationProvider>;
};
