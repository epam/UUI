import * as React from 'react';
import { ColumnsConfig, DataRowProps, useUuiContext, uuiScrollShadows, useColumnsConfig, cx, uuiMarkers, IEditable, DataColumnProps, DataTableState, DataSourceListProps, DataTableColumnsConfigOptions } from '@epam/uui';
import { PositionValues, RenderRowsConfig } from '@epam/uui-components';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import { IconButton, Text, VirtualList } from '../';
import * as css from './DataTable.scss';
import * as searchIcon from '../icons/search-24.svg';

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

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            background={ props.rowBackground }
            borderBottom={ props.border }
            { ...rowProps }
        />
    );

    const renderNoResultsBlock = () => {
        const renderNoResults = () => (
            <div className={ css.noResults }>
                <IconButton icon={ searchIcon } cx={ css.noResultsIcon } />
                <Text fontSize='16' font='sans-semibold'>No Results Found</Text>
                <Text fontSize='14'>We can't find any item matching your request</Text>
            </div>
        );

        return props.renderNoResultsBlock?.() || renderNoResults();
    };

    const getRows = () => {
        const rowRenderer = props.renderRow || renderRow;
        return props.getRows().map(row => rowRenderer({ ...row, columns }));
    };

    const onConfigurationButtonClick = () => {
        uuiModals.show<ColumnsConfig>(modalProps => (
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ columns }
                columnsConfig={ config }
                defaultConfig={ defaultConfig }
            />
        ))
            .then(columnsConfig => props.onValueChange({ ...props.value, columnsConfig }))
            .catch(() => null);
    };

    const renderRowsContainer = ({
        role,
        listContainer,
        estimatedHeight,
        offsetY,
        scrollShadows
    }: RenderRowsConfig) => (
        <div
            role="table"
            aria-colcount={ columns.length }
            aria-rowcount={ props.rowsCount }
            className={ cx(css.table, css.shadowDark, {
                [uuiMarkers.scrolledLeft]: scrollShadows.horizontalLeft,
                [uuiMarkers.scrolledRight]: scrollShadows.horizontalRight
            }) }
        >
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
                    [uuiScrollShadows.topVisible]: scrollShadows.vertical
                }) } />
            </div>
            { props.exactRowsCount !== 0 ? (
                 <div className={ css.listContainer } style={{ minHeight: `${estimatedHeight}px` }}>
                    <div role={ role } ref={ listContainer } style={{ marginTop: offsetY }}>
                        { getRows() }
                    </div>
                    <div className={ cx(uuiScrollShadows.bottom, {
                        [uuiScrollShadows.bottomVisible]: scrollShadows.vertical
                    }) } />
                </div>
            ) : renderNoResultsBlock?.() }
        </div>
    );

    return (
        <VirtualList
            value={ props.value }
            onValueChange={ props.onValueChange }
            onScroll={ props.onScroll }
            rows={ getRows() }
            rowsCount={ props.rowsCount }
            focusedIndex={ props.value?.focusedIndex }
            shadow='dark'
            renderRows={ renderRowsContainer }
        />
    );
};

