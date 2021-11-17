import * as React from 'react';
import {
    ColumnsConfig, DataRowProps, DataColumnProps, IEditable, DataTableState, DataSourceListProps,
    DataTableColumnsConfigOptions, useUuiContext, useColumnsConfig, useVirtual, cx,
} from '@epam/uui';
import type { PositionValues } from '@epam/uui-components';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import { ScrollBars } from '../';
import { useTableShadows } from './hooks/useScrollShadows';
import * as css from './DataTable.scss';

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
}

enum scrollShadowsCx {
    top = 'uui-scroll-shadow-top',
    topVisible = 'uui-scroll-shadow-top-visible',
    bottom = 'uui-scroll-shadow-bottom',
    bottomVisible = 'uui-scroll-shadow-bottom-visible',
    left = 'uui-scroll-shadow-left',
    leftVisible = 'uui-scroll-shadow-left-visible',
    right = 'uui-scroll-shadow-right',
    rightVisible = 'uui-scroll-shadow-right-visible',
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

    const { intersectionRef, ...scrollShadows } = useTableShadows();

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            borderBottom={ props.border }
            { ...rowProps }
        />
    );

    const renderNoResultsBlock = () => {
        // need default behavior
        return props.renderNoResultsBlock?.() || undefined;
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
            </div>
        );
    };

    return (
        <ScrollBars ref={ scrollbarsRef } onScroll={ handleScroll } hideTracksWhenNotNeeded>
            <div
                role="table"
                aria-colcount={ props.columns.length }
                aria-rowcount={ rowsCount }
                className={ cx(css.table, css['shadow-' + (props.shadow || 'dark')]) }
            >
                <DataTableHeaderRow
                    cx={ css.stickyHeader }
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
                { (!props.shadow || props.shadow === 'dark') && (
                    <div className={ cx(scrollShadowsCx.top, {
                        [scrollShadowsCx.topVisible]: scrollShadows.vertical
                    }) } />
                ) }
                <div ref={ intersectionRef } style={{ visibility: 'hidden' }} />
                { props.exactRowsCount !== 0 ? getVirtualisedList() : renderNoResultsBlock() }
                { props.shadow === 'white' && (
                    <div className={ cx(scrollShadowsCx.bottom, {
                        [scrollShadowsCx.bottomVisible]: scrollShadows.vertical
                    }) } />
                ) }
            </div>
        </ScrollBars>
    );
};
