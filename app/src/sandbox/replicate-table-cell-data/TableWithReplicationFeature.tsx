import React, { FC } from "react";
import { TableDataContextProvider } from "./table-data-context";
import { Table } from "./Table";

export const TableWithReplicationFeature: FC = () => {
    return <TableDataContextProvider>
        <Table />
    </TableDataContextProvider>;
};