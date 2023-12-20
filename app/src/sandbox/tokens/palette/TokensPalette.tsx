import React, { useState } from 'react';
import { DataTableHeaderRow, DataTableRow } from '@epam/uui';
import { DataTableRowProps, DataTableState, SortingOption, useArrayDataSource, useColumnsConfig } from '@epam/uui-core';
import { IThemeVar } from './types/sharedTypes';
import { useThemeTokens } from './hooks/useThemeTokens';
import { getColumns } from './tableColumns';

const defaultColumns = getColumns();

export function TokensPalette() {
    const tokens = useThemeTokens();
    const [tableState, setTableState] = useState<DataTableState>({ topIndex: 0, visibleCount: Number.MAX_SAFE_INTEGER });
    const tokensDs = useArrayDataSource<IThemeVar, string, unknown>(
        {
            items: tokens,
            getId: (item) => {
                return item.id;
            },
            sortBy(item: IThemeVar, sorting: SortingOption): any {
                return item[sorting.field as keyof IThemeVar];
            },
        },
        [tokens],
    );
    const tokensDsView = tokensDs.getView(tableState, setTableState, {});
    const { columns, config: columnsConfig } = useColumnsConfig(defaultColumns, tableState.columnsConfig);
    const renderRow = (props: DataTableRowProps<IThemeVar, string>) => {
        return <DataTableRow key={ props.id } { ...props } columns={ columns } />;
    };

    return (
        <div>
            <div>
                <DataTableHeaderRow
                    columns={ columns }
                    allowColumnsResizing={ true }
                    value={ { ...tableState, columnsConfig } }
                    onValueChange={ setTableState }
                />
            </div>
            { tokensDsView.getVisibleRows().map(renderRow) }
        </div>
    );
}
