import * as React from 'react';
import { ScrollBars, PositionValues } from '@epam/uui-components';
import { ColumnsConfig, DataRowProps, uuiMarkers, useUuiContext, useColumnsConfig, cx, useVirtualList, useScrollShadows, IEditable, DataTableState, DataTableColumnsConfigOptions, DataSourceListProps, DataColumnProps } from '@epam/uui';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import * as css from './DataTable.scss';

enum scrollShadowsCx {
    top = 'uui-scroll-shadow-top',
    topVisible = 'uui-scroll-shadow-top-visible',
};

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
}

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
            borderBottom={ props.border }
            { ...rowProps }
        />
    );

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
        // need default behavior
        return props.renderNoResultsBlock?.() || undefined;
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
