import React, { FC, useCallback } from "react";
import { DataTableRow } from "@epam/uui-components";
import { useTableDataContext } from "./table-data-context";
import { COLUMN_IDS, columns } from "./columns";
import { ReplicationHandler, defineReplication } from "./data-replication";

export const [ReplicationContextProvider, useReplication] = defineReplication<string>();

export const Table: FC = () => {
    const [data, setData] = useTableDataContext();

    const handleReplicate = useCallback<ReplicationHandler>(({ startRowIndex, startColumnIndex, endRowIndex, endColumnIndex }) => {
        setData(data.map((item, index) => {
            const isRowInRange = (index <= endRowIndex && index >= startRowIndex) || (index <= startRowIndex && index >= endRowIndex);

            if (isRowInRange) {
                return COLUMN_IDS.reduce((result, current, index) => {
                    const nextResult = { ...result };
                    const isColumnInRange = (index <= endColumnIndex && index >= startColumnIndex) || (index <= startColumnIndex && index >= endColumnIndex);

                    if (isColumnInRange) {
                        nextResult[current] = data[startRowIndex][COLUMN_IDS[startColumnIndex]];
                    }

                    return nextResult;
                }, item);
            }

            return item;
        }));
    }, [setData, data]);

    return <ReplicationContextProvider onReplicate={ handleReplicate }>
        <div>
            { data.map((item, i) =>
                <DataTableRow key={ i } id={ i } rowKey={ `row${i}` } index={ i } value={ item } columns={ columns } />)
            }
        </div>
    </ReplicationContextProvider>;
};
