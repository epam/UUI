import React, { FC, useCallback, useMemo } from "react";
import { DataTableRow, DataTableRowProps } from "@epam/uui-components";
import { DataItemExample, TableDataContextState, useTableDataContext } from "./table-data-context";
import { COLUMN_IDS, getColumns } from "./columns";
import {ReplicationHandler, defineReplication, GetValueToReplicate } from "./data-replication";

interface TableRowProps extends Omit<DataTableRowProps, 'columns'> {
    dataItem: DataItemExample;
    setData: TableDataContextState[1];
}

export const TableReplication = defineReplication<number, keyof DataItemExample, string>();

const TableRow: FC<TableRowProps> = ({ dataItem, setData, ...rowProps }) => {
    const columns = useMemo(() => getColumns(dataItem, setData), [dataItem, setData]);
    return <DataTableRow { ...rowProps } columns={ columns } />;
};

export const Table: FC = () => {
    const [data, setData] = useTableDataContext();

    const handleReplicate = useCallback<ReplicationHandler<number, keyof DataItemExample>>(
        (
            {
                startRowIndex,
                startColumnIndex,
                endRowIndex,
                endColumnIndex,
            },
        ) => {
            setData(data.map((item, index) => {
                const isItemInRange = (index <= endRowIndex && index >= startRowIndex) || (index <= startRowIndex && index >= endRowIndex);
                return isItemInRange
                    ? COLUMN_IDS.reduce((result, current, index) => {
                        const isItemInRange =
                            (index <= endColumnIndex && index >= startColumnIndex)
                            || (index <= startColumnIndex && index >= endColumnIndex);

                        const nextResult = { ...result };

                        if (isItemInRange) {
                            const valueToReplicate = COLUMN_IDS[startColumnIndex] === 'column1'
                                ? (data[startRowIndex][COLUMN_IDS[startColumnIndex]] as DataItemExample["column1"]).value
                                : data[startRowIndex][COLUMN_IDS[startColumnIndex]] as string;

                            if (current === 'column1') {
                                nextResult[current] = { value: valueToReplicate };
                            } else {
                                nextResult[current] = valueToReplicate;
                            }

                        }

                        return nextResult;
                    }, item)
                    : item;
            }));
        }, [setData, data]);

    const getValueToReplicate = useCallback<GetValueToReplicate<number, keyof DataItemExample, string>>(
        (startRowId, startColumnId: keyof DataItemExample) => {
            if (startColumnId === 'column1') {
                return data?.[startRowId]?.[startColumnId]?.value;
            }

            return data?.[startRowId]?.[startColumnId];
        }, [data]);

    return <TableReplication.ContextProvider onReplicate={ handleReplicate } getValueToReplicate={ getValueToReplicate }>
        <div>
            { data.map((item, i) =>
                <TableRow key={ i } id={ i } rowKey={ `row${i}` } index={ i } dataItem={ item } setData={ setData } />)
            }
        </div>
    </TableReplication.ContextProvider>;
};
