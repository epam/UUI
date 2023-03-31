import * as React from 'react';
import { PositionValues, VirtualListRenderRowsParams, IconContainer, DataTableSelectionProvider } from '@epam/uui-components';
import { useColumnsWithFilters } from "../../helpers";
import {
    ColumnsConfig, DataRowProps, useUuiContext, uuiScrollShadows, useColumnsConfig, IEditable,
    DataTableState, DataTableColumnsConfigOptions, DataSourceListProps, DataColumnProps,
    cx, TableFiltersConfig, DataTableRowProps, DataTableSelectedCellData,
} from '@epam/uui-core';
import { DataTableHeaderRow, DataTableRow, DataTableMods, ColumnsConfigurationModal, DataTableRowMods } from './';
import { VirtualList } from '../';
import { ReactComponent as EmptyTableIcon } from '../../icons/empty-table.svg';
import { Text } from "../typography";
import css from './DataTable.scss';
import { i18n } from "../../i18n";

export interface DataTableProps<TItem, TId, TFilter = any> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataTableRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
    filters?: TableFiltersConfig<any>[];
    onCopy?: (
        copyFrom: DataTableSelectedCellData<TItem, TId, TFilter>,
        selectedCells: DataTableSelectedCellData<TItem, TId, TFilter>[],
    ) => void;
}

export function DataTable<TItem, TId>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) {
    const { uuiModals } = useUuiContext();
    const columnsWithFilters = useColumnsWithFilters(props.columns, props.filters);
    const { columns, config, defaultConfig } = useColumnsConfig(columnsWithFilters, props.value?.columnsConfig);

    const renderRow = React.useCallback((rowProps: DataRowProps<TItem, TId> & DataTableRowMods) => {
        return <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            borderBottom={ props.border }
            { ...rowProps }
        />;
    }, []);

    const rows = props.getRows();
    const renderedRows = rows.map(row => (props.renderRow || renderRow)({ ...row, columns }));

    const renderNoResultsBlock = React.useCallback(() => {
        return (
            <div className={ css.noResults }>
                { props.renderNoResultsBlock ? props.renderNoResultsBlock?.() :
                    <>
                        <IconContainer cx={ css.noResultsIcon } icon={ EmptyTableIcon } />
                        <Text cx={ css.noResultsTitle } fontSize='24' lineHeight='30' color='primary' font='semibold'>{ i18n.tables.noResultsBlock.title }</Text>
                        <Text fontSize='16' lineHeight='24' font='regular' color='primary'>{ i18n.tables.noResultsBlock.message }</Text>
                    </>
                }
            </div>
        );
    }, [props.renderNoResultsBlock]);

    const onConfigurationButtonClick = React.useCallback(() => {
        uuiModals.show<ColumnsConfig>(modalProps => (
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ props.columns }
                columnsConfig={ config }
                defaultConfig={ defaultConfig }
            />
        ))
            .then(columnsConfig => props.onValueChange({ ...props.value, columnsConfig }))
            .catch(() => null);
    }, [props.columns, config, defaultConfig, props.value, props.onValueChange]);

    const renderRowsContainer = React.useCallback(({ listContainerRef, estimatedHeight, offsetY, scrollShadows }: VirtualListRenderRowsParams) => (
        <>
            <div className={ css.stickyHeader }>
                <DataTableHeaderRow
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
                <div className={ cx(uuiScrollShadows.top, {
                    [uuiScrollShadows.topVisible]: scrollShadows.verticalTop,
                }) } />
            </div>
            { props.exactRowsCount !== 0 ? (
                <div className={ css.listContainer } style={ { minHeight: `${ estimatedHeight }px` } }>
                    <div
                        ref={ listContainerRef }
                        role='rowgroup'
                        style={ { marginTop: offsetY } }
                        children={ renderedRows }
                    />
                </div>
            ) : renderNoResultsBlock?.() }
        </>
    ), [props, columns, rows, renderNoResultsBlock, onConfigurationButtonClick]);

    return (
        <DataTableSelectionProvider onCopy={ props.onCopy } rows={ rows } columns={ columns }>
            <VirtualList
                value={ props.value }
                onValueChange={ props.onValueChange }
                onScroll={ props.onScroll }
                rows={ renderedRows }
                rowsCount={ props.rowsCount }
                renderRows={ renderRowsContainer }
                cx={ cx(css.table) }
                rawProps={ {
                    role: 'table',
                    'aria-colcount': columns.length,
                    'aria-rowcount': props.rowsCount,
                } }
            />
        </DataTableSelectionProvider>
    );
}
