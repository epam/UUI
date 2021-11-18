import * as React from 'react';
import {
    ColumnsConfig, cx, DataRowProps, IEditable, DataTableState, DataSourceListProps, DataColumnProps,
    DataTableColumnsConfigOptions, useUuiContext, useColumnsConfig, useVirtual, uuiMarkers
} from '@epam/uui';
import type { PositionValues } from '@epam/uui-components';
import { useTableShadows } from './hooks/useScrollShadows';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import { ScrollBars, IconButton, Text } from '../';
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
    bottom = 'uui-scroll-shadow-bottom',
    bottomVisible = 'uui-scroll-shadow-bottom-visible'
};

export function DataTable<TItem, TId>({
    value,
    onValueChange,
    onScroll,
    rowsCount,
    ...props
}: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) {
    const { uuiModals } = useUuiContext();
    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, value.columnsConfig);
    const { listRef, scrollbarsRef, estimatedHeight, offsetY, handleScroll } = useVirtual<HTMLDivElement>({
        value,
        onValueChange,
        onScroll,
        rowsCount
    });

    const { verticalRef, horizontalRef, ...scrollShadows } = useTableShadows({ root: document.querySelector("[role='table']") });

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            background={ props.rowBackground }
            borderBottom={ props.border }
            { ...rowProps }
        />
    );

    const renderTopShadow = () => (!props.shadow || props.shadow === 'dark') && (
        <div className={ cx(scrollShadowsCx.top, {
            [scrollShadowsCx.topVisible]: scrollShadows.vertical
        }) } />
    );

    const renderBottomShadow = () => props.shadow === 'white' && (
        <div className={ cx(scrollShadowsCx.bottom, {
            [scrollShadowsCx.bottomVisible]: scrollShadows.vertical
        }) } />
    );

    const getVirtualisedList = () => {
        const renderItemRow = props.renderRow || renderRow;
        const rows = props.getRows().map(row => renderItemRow({ ...row, columns }));

        return (
            <div
                ref={ listRef }
                role='rowgroup'
                className={ css.listContainer }
                style={ { marginTop: offsetY, minHeight: `${estimatedHeight}px` } }>
                { rows }
                { renderBottomShadow() }
            </div>
        );
    };

    const onConfigurationButtonClick = () => {
        uuiModals.show<ColumnsConfig>(modalProps => (
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
        <ScrollBars ref={ scrollbarsRef } onScroll={ handleScroll } hideTracksWhenNotNeeded>
            <div
                role="table"
                aria-colcount={ props.columns.length }
                aria-rowcount={ rowsCount }
                className={ cx(css.table, css['shadow-' + (props.shadow || 'dark')], {
                    [uuiMarkers.scrolledLeft]: scrollShadows.horizontal,
                    [uuiMarkers.scrolledRight]: scrollShadows.horizontal
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
                        value={ value }
                        onValueChange={ onValueChange }
                    />
                    { renderTopShadow() }
                </div>
                <div ref={ verticalRef } className={ css.verticalIntersectingRect } />
                <div ref={ horizontalRef } className={ css.horizontalIntersectingRect } />
                { props.exactRowsCount !== 0 ? getVirtualisedList() : renderNoResultsBlock() }
            </div>
        </ScrollBars>
    );
};

