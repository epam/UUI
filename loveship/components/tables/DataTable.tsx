import React from 'react';
import {
    ColumnsConfig, cx, DataRowProps, IEditable, DataTableState, DataSourceListProps, DataColumnProps,
    DataTableColumnsConfigOptions, useUuiContext, useColumnsConfig,
} from '@epam/uui';
import type { PositionValues } from '@epam/uui-components';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import { FlexRow, IconButton, VirtualList, Text } from '../';
import * as css from './DataTable.scss';
import * as searchIcon from '../icons/search-24.svg';

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
}

export function DataTable<TItem, TId = any>({
    value,
    onValueChange,
    onScroll,
    rowsCount,
    ...props
}: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) {
    const context = useUuiContext();
    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, value.columnsConfig);

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            background={ props.rowBackground }
            borderBottom={ props.border }
            { ...rowProps }
        />
    );

    const getRows = () => {
        const renderItemRow = props.renderRow || renderRow;
        return props.getRows().map((row: DataRowProps<TItem, TId>) => renderItemRow({ ...row, columns }));
    };

    const onConfigurationButtonClick = () => {
        context.uuiModals.show<ColumnsConfig>(modalProps => (
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ props.columns }
                columnsConfig={ config }
                defaultConfig={ defaultConfig }

            />
        ))
            .then(columnsConfig => onValueChange({ ...value, columnsConfig }))
            .catch(() => null);
    };

    const renderNoResultsBlock = () => {
        const renderNoResults = () => (
            <div className={ cx(css.noResults) }>
                <IconButton icon={ searchIcon } cx={ css.noResultsIcon }/>
                <Text fontSize='16' font='sans-semibold'>No Results Found</Text>
                <Text fontSize='14'>We can't find any item matching your request</Text>
            </div>
        );

        return props.renderNoResultsBlock?.() || renderNoResults();
    };

    return (
        <div className={ css.table } role="table" aria-rowcount={ props.getRows().length } aria-colcount={ columns.length }>
            <DataTableHeaderRow
                columns={ columns }
                onConfigButtonClick={ props.showColumnsConfig && onConfigurationButtonClick }
                selectAll={ props.selectAll }
                size={ props.size }
                textCase={ props.headerTextCase }
                allowColumnsReordering={ props.allowColumnsReordering }
                allowColumnsResizing={ props.allowColumnsResizing }
                value={ value }
                onValueChange={ onValueChange }
            />
            <FlexRow
                topShadow
                background='white'
                cx={ css.body }>
                { props.exactRowsCount !== 0 ? (
                    <VirtualList
                        value={ value }
                        onValueChange={ onValueChange }
                        onScroll={ onScroll }
                        rows={ getRows() }
                        rowsCount={ rowsCount }
                        focusedIndex={ value?.focusedIndex }
                    />
                ) : renderNoResultsBlock() }
            </FlexRow>
        </div>
    );
};

