import React, { FC } from "react";
import { TableDataContextProvider1, TableDataContextProvider2 } from "./table-data-context";
import { Table1, Table2 } from "./Table";

export const TableWithReplicationFeature: FC = () => {
    return <>
        <TableDataContextProvider1>
            <Table1 />
        </TableDataContextProvider1>
        {/* <div style={ { width: '100px' } } /> */ }
        {/* <TableDataContextProvider2>
            <Table2 />
        </TableDataContextProvider2> */}
    </>;
};