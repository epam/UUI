import * as React from 'react';
import {
    PositionValues, VirtualListRenderRowsParams, useColumnsWithFilters,
    IconContainer
} from '@epam/uui-components';
import {
    ColumnsConfig, useUuiContext, uuiScrollShadows, useColumnsConfig, IEditable,
    DataTableState, DataTableColumnsConfigOptions, DataSourceListProps, DataColumnProps,
    cx, TableFiltersConfig, DataTableRowProps, RowProps, Subtotals, isSubtotalRecord
} from '@epam/uui-core';
import { DataTableHeaderRow, DataTableRow, DataTableMods, ColumnsConfigurationModal } from './';
import { VirtualList } from '../';
import { ReactComponent as EmptyTableIcon } from '../../icons/empty-table.svg';
import { Text } from "../typography";
import css from './DataTable.scss';
import { i18n } from "../../i18n";

export interface DataTableProps<TItem, TId, TSubtotals = void> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): RowProps<TItem, TId, TSubtotals>[];
    columns: DataColumnProps<TItem, TId>[];
    subtotalsColumns?: Exclude<TSubtotals extends void ? void : DataColumnProps<TSubtotals, string>, void>[];
    renderRow?(props: DataTableRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
    filters?: TableFiltersConfig<any>[];
}

const isSubtotalRow = <TItem, TId, TSubtotals = void>(
    row: DataTableRowProps<TItem, TId> | DataTableRowProps<Subtotals<TSubtotals, TId>, string>
): row is DataTableRowProps<Subtotals<TSubtotals, TId>, string> => {
    return isSubtotalRecord<TItem, TId, TSubtotals>(row.value);
};

export function DataTable<TItem, TId, TSubtotals = void>(props: React.PropsWithChildren<DataTableProps<TItem, TId, TSubtotals> & DataTableMods>) {
    const { uuiModals } = useUuiContext();
    const columnsWithFilters = useColumnsWithFilters(props.columns, props.filters);
    const { columns, config, defaultConfig } = useColumnsConfig(columnsWithFilters, props.value?.columnsConfig);

    const renderRow = React.useCallback((rowProps: DataTableRowProps<TItem, TId> | DataTableRowProps<Subtotals<TSubtotals, TId>, string>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            borderBottom={ props.border }
            { ...rowProps }
        />
    ), [props.size, props.border]);

    const rows = props.getRows().map(row => {
        if (isSubtotalRow<TItem, TId, TSubtotals>(row)) {
            const subtotalRow: DataTableRowProps<Subtotals<TSubtotals, TId>, string> = row;
            return renderRow({ ...subtotalRow, columns: props.subtotalsColumns ?? [] });
        }

        const dataRow = row as DataTableRowProps<TItem, TId>;
        return (props.renderRow || renderRow)({ ...dataRow, columns })
    });

    const renderNoResultsBlock = React.useCallback(() => {
        return (
            <div className={ css.noResults }>
                { props.renderNoResultsBlock ? props.renderNoResultsBlock?.() :
                    <>
                        <IconContainer cx={ css.noResultsIcon } icon={ EmptyTableIcon } />
                        <Text cx={ css.noResultsTitle } fontSize='24' lineHeight='30' color='gray80' font='sans-semibold'>{ i18n.dataTable.title }</Text>
                        <Text fontSize='16' lineHeight='24' font='sans' color='gray80'>{ i18n.dataTable.message }</Text>
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
                    [uuiScrollShadows.topVisible]: scrollShadows.vertical,
                }) } />
            </div>
            { props.exactRowsCount !== 0 ? (
                <div className={ css.listContainer } style={ { minHeight: `${ estimatedHeight }px` } }>
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
