import React, { useState, ReactNode } from 'react';
import {
    ColumnsConfig, DataRowProps, ScrollManager, DataColumnProps, IEditable, DataTableState, DataSourceListProps,
    DataTableColumnsConfigOptions, useUuiContext, useColumnsConfig,
} from '@epam/uui';
import type { PositionValues } from '@epam/uui-components';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableScrollRow, DataTableMods } from './';
import { FlexRow, VirtualList } from '../';
import * as css from './DataTable.scss';

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): ReactNode;
    renderNoResultsBlock?(): ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
}

export const DataTable = <TItem, TId>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) => {
    const [scrollManager] = useState(new ScrollManager());
    const context = useUuiContext();

    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, props.value.columnsConfig);

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            borderBottom={ props.border }
            { ...rowProps }
        />
    );

    const getRows = () => {
        const renderItemRow = props.renderRow || renderRow;
        return props.getRows().map(row => renderItemRow({ ...row, scrollManager, columns }));
    };

    const renderNoResultsBlock = () => {
        // need default behavior

        return props.renderNoResultsBlock ? props.renderNoResultsBlock() : undefined;
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
            .then(columnsConfig => props.onValueChange({ ...props.value, columnsConfig }))
            .catch(() => null);
    };

    return (
        <>
            <DataTableHeaderRow
                key='header'
                scrollManager={ scrollManager }
                columns={ columns }
                onConfigButtonClick={ props.showColumnsConfig && onConfigurationButtonClick }
                selectAll={ props.selectAll }
                size={ props.size }
                textCase={ props.headerTextCase }
                allowColumnsReordering={ props.allowColumnsReordering }
                allowColumnsResizing={ props.allowColumnsResizing }
                value={ props.value }
                onValueChange={ props.onValueChange }
            />
            <FlexRow
                key='body'
                topShadow
                background='white'
                cx={ css.body }
            >
                { props.exactRowsCount !== 0 ? (
                    <VirtualList
                        value={ props.value }
                        onValueChange={ props.onValueChange }
                        onScroll={ props.onScroll }
                        rows={ getRows() }
                        rowsCount={ props.rowsCount }
                        focusedIndex={ props.value?.focusedIndex }
                        shadow='dark'
                    />
                ) : renderNoResultsBlock() }
            </FlexRow>
            <DataTableScrollRow key='scroll' scrollManager={ scrollManager } columns={ columns } />
        </>
    );
};
