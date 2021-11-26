import * as React from 'react';
import { ColumnsConfig, cx, DataRowProps, useUuiContext, useColumnsConfig, useVirtualList, useScrollShadows, IEditable, uuiMarkers, DataColumnProps, DataTableState, DataSourceListProps, DataTableColumnsConfigOptions } from '@epam/uui';
import { PositionValues, ScrollBars } from '@epam/uui-components';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import { IconButton, Text } from '../';
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

enum scrollShadowsCx {
    top = 'uui-scroll-shadow-top',
    topVisible = 'uui-scroll-shadow-top-visible',
};

export function DataTable<TItem, TId>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) {
    const { uuiModals } = useUuiContext();
    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, props.value?.columnsConfig);
    const { listRef, scrollbarsRef, offsetY, handleScroll, estimatedHeight } = useVirtualList<HTMLDivElement, HTMLDivElement>({
        value: props.value,
        onValueChange: props.onValueChange,
        onScroll: props.onScroll,
        rowsCount: props.rowsCount
    });

    const { verticalRef, horizontalRef, ...scrollShadows } = useScrollShadows({
        root: scrollbarsRef.current?.container
    });

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            background={ props.rowBackground }
            borderBottom={ props.border }
            { ...rowProps }
        />
    );

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

    const getVirtualisedList = () => {
        const rowRenderer = props.renderRow || renderRow;
        const rows = props.getRows().map(row => rowRenderer({ ...row, columns }));

        return (
            <div className={ css.listContainer } style={{ minHeight: `${estimatedHeight}px` }}>
                <div role='rowgroup' ref={ listRef } style={{ marginTop: offsetY }}>
                    { rows }
                </div>
            </div>
        );
    };

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

    return (
        <ScrollBars ref={ scrollbarsRef } onScroll={ handleScroll }>
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
                    <div className={ cx(scrollShadowsCx.top, {
                        [scrollShadowsCx.topVisible]: scrollShadows.vertical
                    }) } />
                </div>
                <div ref={ verticalRef } className={ css.verticalIntersectingRect } />
                <div ref={ horizontalRef } className={ css.horizontalIntersectingRect } />
                { props.exactRowsCount !== 0 ? getVirtualisedList() : renderNoResultsBlock?.() }
            </div>
        </ScrollBars>
    );
};

