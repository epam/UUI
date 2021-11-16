import React from 'react';
import {
    ColumnsConfig, DataRowProps, DataColumnProps, IEditable, DataTableState, DataSourceListProps,
    DataTableColumnsConfigOptions, useUuiContext, useColumnsConfig, useVirtual, cx,
} from '@epam/uui';
import { PositionValues } from '@epam/uui-components';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import { ScrollBars } from '../';
import * as css from './DataTable.scss';

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
}

export const DataTable = <TItem, TId = any>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) => {
    const { uuiModals } = useUuiContext();
    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, props.value.columnsConfig);
    const {
        listRef,
        scrollbarsRef,
        estimatedHeight,
        offsetY,
        handleScroll,
    } = useVirtual<HTMLDivElement>({
        value: props.value,
        onValueChange: props.onValueChange,
        onScroll: props.onScroll,
        rowsCount: props.rowsCount,
        focusedIndex: props.value.focusedIndex
    });

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
            .then(columnsConfig => props.onValueChange({ ...props.value, columnsConfig }))
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
        <ScrollBars
            ref={ scrollbarsRef }
            onScroll={ handleScroll }
            hideTracksWhenNotNeeded
            autoHeightMax={ estimatedHeight }
        >
            <div
                role="table"
                aria-colcount={ props.columns.length }
                aria-rowcount={ props.rowsCount }
                className={ cx(css.table, css['shadow-' + (props.shadow || 'dark')]) }
            >
                <DataTableHeaderRow
                    columns={ columns }
                    onConfigButtonClick={ props.showColumnsConfig && onConfigurationButtonClick }
                    selectAll={ props.selectAll }
                    size={ props.size }
                    cx={ css.stickyHeader }
                    textCase={ props.headerTextCase }
                    allowColumnsReordering={ props.allowColumnsReordering }
                    allowColumnsResizing={ props.allowColumnsResizing }
                    value={ props.value }
                    onValueChange={ props.onValueChange }
                />
                { (!props.shadow || props.shadow === 'dark') && (
                    <div className='uui-scroll-shadow-top' style={{ opacity: 1 }} />
                ) }
                { props.exactRowsCount !== 0 ? getVirtualisedList() : renderNoResultsBlock() }
                { props.shadow === 'white' && (
                    <div className='uui-scroll-shadow-bottom' style={{ opacity: 1 }} />
                ) }
            </div>
        </ScrollBars>
    );
};
