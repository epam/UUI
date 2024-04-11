import React, { useMemo } from 'react';
import { ColumnsConfig, DataColumnProps, orderBy } from '@epam/uui-core';
import { Accordion } from '@epam/uui';
import Column from './Column';

interface IColumnsBlockProps {
    columnsConfig?: ColumnsConfig;
    onColumnsConfigChange(newConfig: ColumnsConfig): void;
    columns: DataColumnProps<any>[];
}

const ColumnsBlock: React.FC<IColumnsBlockProps> = (props) => {
    const items = useMemo(() => {
        const columnsConfig = props.columnsConfig || {};
        const sortedColumns = orderBy(
            props.columns.filter((column) => !!column.caption),
            (i) => columnsConfig[i.key]?.order,
        );

        return sortedColumns.map((column) => ({
            key: column.key,
            caption: column.caption,
            isVisible: columnsConfig[column.key]?.isVisible,
            isDisabled: column.isAlwaysVisible || !!column.fix,
        }));
    }, [props.columns, props.columnsConfig]);

    return (
        <Accordion title="Columns" mode="inline" padding="18">
            {items.map((item) => (
                <Column value={ props.columnsConfig } onValueChange={ props.onColumnsConfigChange } columnInfo={ item } key={ item.key } />
            ))}
        </Accordion>
    );
};

export default /* @__PURE__ */React.memo(ColumnsBlock);
