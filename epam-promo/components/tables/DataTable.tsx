import * as React from 'react';
import { PositionValues, VirtualListRenderRowsParams } from '@epam/uui-components';
import { ColumnsConfig, DataRowProps, useUuiContext, uuiScrollShadows, useColumnsConfig, IEditable, DataTableState, DataTableColumnsConfigOptions, DataSourceListProps, DataColumnProps, cx } from '@epam/uui';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import { VirtualList } from '../';
import * as css from './DataTable.scss';

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
};

export function DataTable<TItem, TId>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) {
    const { uuiModals } = useUuiContext();
    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, props.value?.columnsConfig);

    const renderRow = React.useCallback((rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey + rowProps.id + rowProps.index }
            size={ props.size }
            borderBottom={ props.border }
            { ...rowProps }
        />
    ), [props.size, props.border]);

    const rows = props.getRows().map(row => (props.renderRow || renderRow)({ ...row, columns }));

    const renderNoResultsBlock = React.useCallback(() => {
        // need default behavior
        return props.renderNoResultsBlock?.() || undefined;
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
                    [uuiScrollShadows.topVisible]: scrollShadows.vertical,
                }) } />
            </div>
            { props.exactRowsCount !== 0 ? (
                <div className={ css.listContainer } style={ { minHeight: `${estimatedHeight}px` } }>
                    <div
                        ref={ listContainerRef }
                        role='rowgroup'
                        style={ { marginTop: offsetY } }
                        children={ rows }
                    />
                </div>
            ) : renderNoResultsBlock?.() }
        </>
    ), [props, columns, rows, renderNoResultsBlock, onConfigurationButtonClick]);

    return (
        <VirtualList
            value={ props.value }
            onValueChange={ props.onValueChange }
            onScroll={ props.onScroll }
            rows={ rows }
            rowsCount={ props.rowsCount }
            focusedIndex={ props.value?.focusedIndex }
            shadow='dark'
            renderRows={ renderRowsContainer }
            cx={ cx(css.table, css.shadowDark) }
            rawProps={ {
                role: 'table',
                'aria-colcount': columns.length,
                'aria-rowcount': props.rowsCount,
            } }
        />
    );
}