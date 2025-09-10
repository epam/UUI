import * as React from 'react';
import {
    ColumnsConfig, DataRowProps, useUuiContext, uuiScrollShadows, useColumnsConfig, IEditable, DataTableState, DataTableColumnsConfigOptions,
    DataSourceListProps, DataColumnProps, cx, TableFiltersConfig, DataTableRowProps, DataTableSelectedCellData, Overwrite,
    DataColumnGroupProps, IHasCX,
} from '@epam/uui-core';
import { IconContainer, DataTableSelectionProvider, DataTableFocusManager, DataTableFocusProvider } from '@epam/uui-components';
import { useColumnsWithFilters } from '../../helpers';
import { DataTableHeaderRow } from './DataTableHeaderRow';
import { DataTableRow } from './DataTableRow';
import { Text } from '../typography';
import { VirtualList, VirtualListRenderRowsParams, VirtualListProps } from '../layout';
import { ColumnsConfigurationModal, ColumnsConfigurationModalProps } from './columnsConfigurationModal';
import { DataRowsContainer } from './DataRowsContainer';
import type { DataTableMods, DataTableRowMods } from './types';

import { i18n } from '../../i18n';
import { settings } from '../../settings';

import './variables.scss';
import css from './DataTable.module.scss';

interface DataTableCoreProps<TItem, TId, TFilter = any> extends IEditable<DataTableState>, IHasCX, DataSourceListProps, DataTableColumnsConfigOptions, Pick<VirtualListProps, 'onScroll'> {
    /** Callback to get rows that will be rendered in table */
    getRows?(): DataRowProps<TItem, TId>[];

    /** Rows that should be rendered in table */
    rows?: DataRowProps<TItem, TId>[];

    /** Array of all possible column groups for the table */
    columnGroups?: DataColumnGroupProps[];

    /** Array of all possible columns for the table */
    columns: DataColumnProps<TItem, TId>[];

    /** Render callback for the table row.
     * If omitted, default DataTableRow implementation will be rendered.
     * */
    renderRow?(props: DataTableRowProps<TItem, TId>): React.ReactNode;

    /** Render callback for the 'No results' block. Will be rendered when table doesn't have rows for displaying, e.g. after search applying.
     * If omitted, default implementation will be rendered.
     * */
    renderNoResultsBlock?(): React.ReactNode;

    /** Pass true to enable the column configuration button in the last column header. On this button click will show the columns configuration modal.
     * Note that you need to have at least one column fixed to the right for proper display
     * */
    showColumnsConfig?: boolean;

    /** Array of filters to be added to the column header.
     * For each filter, you need to specify the `columnKey` of the column where it will be attached.
     * */
    filters?: TableFiltersConfig<any>[];

    /** Called when cell content is copied to other cells via the DataTable cell copying mechanism.
     * This callback is typically used to update the state according to the changes.
     * To enable cell copying, provide the canCopy prop for the column.
     * */
    onCopy?: (copyFrom: DataTableSelectedCellData<TItem, TId, TFilter>, selectedCells: DataTableSelectedCellData<TItem, TId, TFilter>[]) => void;

    /** Render callback for column configuration modal.
     * If omitted, default `ColumnsConfigurationModal` implementation will be rendered.
     */
    renderColumnsConfigurationModal?: (props: ColumnsConfigurationModalProps<TItem, TId, TFilter>) => React.ReactNode;

    /**
     * Focus manipulation manager in tables.
     */
    dataTableFocusManager?: DataTableFocusManager<TId>;

    /**
     * Enables collapse/expand all functionality.
     * */
    showFoldAll?: boolean;
}

export interface DataTableModsOverride {}

export interface DataTableProps<TItem, TId> extends React.PropsWithChildren<DataTableCoreProps<TItem, TId> & Overwrite<DataTableMods, DataTableModsOverride>> {}

export function DataTable<TItem, TId>(props: DataTableProps<TItem, TId>) {
    const { uuiModals } = useUuiContext();
    const headerRef = React.useRef<HTMLDivElement>(undefined);
    const columnsWithFilters = useColumnsWithFilters(props.columns, props.filters);
    const { columns, config, defaultConfig } = useColumnsConfig(columnsWithFilters, props.value?.columnsConfig);

    const defaultRenderRow = React.useCallback((rowProps: DataRowProps<TItem, TId> & DataTableRowMods) => {
        return (
            <DataTableRow
                size={ props.size || settings.dataTable.sizes.body.row }
                columnsGap={ props.columnsGap }
                borderBottom={ props.border }
                { ...rowProps }
                key={ rowProps.rowKey }
                cx={ css.cell }
            />
        );
    }, []);

    const renderRow = (row: DataRowProps<TItem, TId>) => (props.renderRow ?? defaultRenderRow)({ ...row, columns });
    const rows = props.getRows?.() ?? props.rows ?? [];

    const renderNoResultsBlock = React.useCallback(() => {
        return (
            <div className={ css.noResults }>
                {props.renderNoResultsBlock ? (
                    props.renderNoResultsBlock?.()
                ) : (
                    <>
                        <IconContainer cx={ css.icon } icon={ settings.dataTable.icons.emptyTable } />
                        <Text cx={ css.title } fontSize="24" lineHeight="30" color="primary" fontWeight="600">
                            {i18n.tables.noResultsBlock.title}
                        </Text>
                        <Text fontSize="16" lineHeight="24" color="primary">
                            {i18n.tables.noResultsBlock.message}
                        </Text>
                    </>
                )}
            </div>
        );
    }, [props.renderNoResultsBlock]);

    const onConfigurationButtonClick = React.useCallback(() => {
        const configProps = { columns: props.columns, columnsConfig: { ...config }, defaultConfig };

        uuiModals
            .show<ColumnsConfig>((modalProps) => {
            return (
                props.renderColumnsConfigurationModal
                    ? props.renderColumnsConfigurationModal({ ...configProps, ...modalProps })
                    : (
                        <ColumnsConfigurationModal
                            { ...modalProps }
                            columns={ props.columns }
                            columnGroups={ props.columnGroups }
                            columnsConfig={ config }
                            defaultConfig={ defaultConfig }
                        />
                    )
            );
        })
            .then((columnsConfig) => props.onValueChange({ ...props.value, columnsConfig }))
            .catch(() => null);
    }, [
        props.columns, config, defaultConfig, props.value, props.onValueChange, props.renderColumnsConfigurationModal,
    ]);

    const renderRowsContainer = React.useCallback(
        ({ listContainerRef, estimatedHeight, offsetY, scrollShadows }: VirtualListRenderRowsParams) => (
            <>
                <div className={ cx(css.stickyHeader, 'uui-dt-sticky_header') } ref={ headerRef }>
                    <DataTableHeaderRow
                        columns={ columns }
                        columnGroups={ props.columnGroups }
                        onConfigButtonClick={ props.showColumnsConfig && onConfigurationButtonClick }
                        selectAll={ props.selectAll }
                        size={ props.headerSize || settings.dataTable.sizes.header.row }
                        textCase={ props.headerTextCase }
                        allowColumnsReordering={ props.allowColumnsReordering }
                        allowColumnsResizing={ props.allowColumnsResizing }
                        showFoldAll={ props.showFoldAll }
                        value={ { ...props.value, columnsConfig: config } }
                        onValueChange={ props.onValueChange }
                        columnsGap={ props.columnsGap }
                    />
                    <div
                        className={ cx(uuiScrollShadows.top, {
                            [uuiScrollShadows.topVisible]: scrollShadows.verticalTop,
                        }) }
                    />
                </div>
                {props.exactRowsCount !== 0 ? (
                    <DataRowsContainer
                        headerRef={ headerRef }
                        listContainerRef={ listContainerRef }
                        estimatedHeight={ estimatedHeight }
                        offsetY={ offsetY }
                        scrollShadows={ scrollShadows }
                        renderRow={ renderRow }
                        rows={ rows }
                    />
                ) : (
                    renderNoResultsBlock?.()
                )}
            </>
        ),
        [
            props, columns, rows, renderNoResultsBlock, onConfigurationButtonClick,
        ],
    );

    return (
        <DataTableSelectionProvider onCopy={ props.onCopy } rows={ rows } columns={ columns }>
            <DataTableFocusProvider dataTableFocusManager={ props.dataTableFocusManager }>
                <VirtualList
                    value={ props.value }
                    onValueChange={ props.onValueChange }
                    onScroll={ props.onScroll }
                    rowsCount={ props.rowsCount }
                    renderRows={ renderRowsContainer }
                    cx={ cx(css.root, props.cx, 'uui-dt-vars', 'uui-data_table') }
                    isLoading={ props.isReloading }
                    rowsSelector="[role=row]"
                    rawProps={ {
                        role: 'table',
                        'aria-colcount': columns.length,
                        'aria-rowcount': props.rowsCount,
                    } }
                />
            </DataTableFocusProvider>
        </DataTableSelectionProvider>
    );
}
