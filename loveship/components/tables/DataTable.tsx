import * as React from 'react';
import { ColumnsConfig, DataRowProps, useUuiContext, uuiScrollShadows, useColumnsConfig, cx, IEditable, DataColumnProps, DataTableState, DataSourceListProps, DataTableColumnsConfigOptions } from '@epam/uui-core';
import { PositionValues, VirtualListRenderRowsParams } from '@epam/uui-components';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import { IconButton, Text, VirtualList } from '../';
import * as css from './DataTable.scss';
import { ReactComponent as SearchIcon } from '../icons/search-24.svg';

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
}

function DataTableNoResults() {
    return (
        <div className={ css.noResults }>
            <IconButton icon={ SearchIcon } cx={ css.noResultsIcon } />
            <Text fontSize='16' font='sans-semibold'>No Results Found</Text>
            <Text fontSize='14'>We can't find any item matching your request</Text>
        </div>
    );
}

export function DataTable<TItem, TId>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) {
    const { uuiModals } = useUuiContext();
    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, props.value?.columnsConfig);

    const renderRow = React.useCallback((rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            background={ props.rowBackground }
            borderBottom={ props.border }
            { ...rowProps }
        />
    ), [props.border, props.size, props.rowBackground]);

    const renderNoResultsBlock = React.useCallback(() => {
        return props.renderNoResultsBlock?.() || <DataTableNoResults />;
    }, [props.renderNoResultsBlock]);

    const rows = props.getRows().map(row => (props.renderRow || renderRow)({ ...row, columns }));

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

    const renderRowsContainer = React.useCallback(
        ({ listContainerRef, estimatedHeight, offsetY, scrollShadows }: VirtualListRenderRowsParams) => (
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
            renderRows={ renderRowsContainer }
            cx={ cx(css.table) }
            rawProps={ {
                role: 'table',
                'aria-colcount': columns.length,
                'aria-rowcount': props.rowsCount,
            } }
        />
    );
}

