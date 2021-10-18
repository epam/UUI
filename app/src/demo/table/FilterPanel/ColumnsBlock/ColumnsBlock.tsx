import React, { useCallback, useMemo } from "react";
import sortBy from "lodash.sortby";
import { Accordion } from "@epam/promo";
import { ColumnsConfig, DataColumnProps, getColumnsConfig, IEditable } from "@epam/uui";
import { ITableStateApi, PersonsTableState } from "../../types";
import Column from "./Column";

interface IColumnsBlockProps {
    tableStateApi: ITableStateApi;
    columns: DataColumnProps<any>[];
}

const ColumnsBlock: React.FC<IColumnsBlockProps> = ({ tableStateApi, columns }) => {
    const columnsConfig = useMemo(() => {
        return tableStateApi.columnsConfig ?? getColumnsConfig(columns, {});
    }, [columns, tableStateApi.columnsConfig]);

    const items = useMemo(() => {
        const sortedColumns = sortBy(columns.filter(column => !!column.caption), i => {
            columnsConfig[i.key]?.order;
        });

        return sortedColumns.map(column => ({
            key: column.key,
            caption: column.caption,
            isVisible: columnsConfig[column.key]?.isVisible,
            isDisabled: column.isAlwaysVisible || !!column.fix,
        }));
    }, [columns, columnsConfig]);

    return (
        <Accordion title="Columns" mode="inline" padding="18">
            { items.map(item => (
                <Column
                    value={ columnsConfig }
                    onValueChange={ tableStateApi.onColumnsConfigChange }
                    columnInfo={ item }
                />
            )) }
        </Accordion>
    );
};

export default React.memo(ColumnsBlock);