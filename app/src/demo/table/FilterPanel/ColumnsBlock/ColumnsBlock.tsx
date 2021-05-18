import React, { useCallback, useMemo } from "react";
import sortBy from "lodash.sortby";
import { Accordion } from "@epam/promo";
import { ColumnsConfig, DataColumnProps, getColumnsConfig, IEditable } from "@epam/uui";
import { PersonsTableState } from "../../types";
import Column from "./Column";

interface IColumnsBlockProps extends IEditable<PersonsTableState> {
    columns: DataColumnProps<any>[];
}

const ColumnsBlock: React.FC<IColumnsBlockProps> = ({ value, onValueChange, columns }) => {
    const columnsConfig = useMemo(() => {
        return value.columnsConfig ?? getColumnsConfig(columns, {});
    }, [columns, value]);
    
    const handleChange = useCallback((newColumnsConfig: ColumnsConfig) => {
        onValueChange({
            ...value,
            columnsConfig: newColumnsConfig,
        });
    }, [value, onValueChange]);

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
                    onValueChange={ handleChange }
                    columnInfo={ item }
                />
            )) }
        </Accordion>
    );
};

export default React.memo(ColumnsBlock);