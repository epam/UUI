import * as React from 'react';
import { PositionValues, IconContainer, DataTableSelectionProvider } from '@epam/uui-components';
import { useColumnsWithFilters } from '../../helpers';
import {
    ColumnsConfig, DataRowProps, useUuiContext, uuiScrollShadows, useColumnsConfig, IEditable, DataTableState, DataTableColumnsConfigOptions,
    DataSourceListProps, DataColumnProps, cx, TableFiltersConfig, DataTableRowProps, DataTableSelectedCellData,
} from '@epam/uui-core';
import { DataTableHeaderRow } from './DataTableHeaderRow';
import { DataTableRow } from './DataTableRow';
import { DataTableMods, DataTableRowMods } from './types';
import { ColumnsConfigurationModal, ColumnsConfigurationModalProps } from './columnsConfigurationModal';
import { VirtualList, Blocker, VirtualListRenderRowsParams } from '../layout';
import { ReactComponent as EmptyTableIcon } from '../../icons/empty-table.svg';
import { Text } from '../typography';
import css from './DataTable.module.scss';
import { i18n } from '../../i18n';
import { DataRowsContainer } from './DataRowsContainer';

export interface DataTableProps<TItem, TId, TFilter = any> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataTableRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
    filters?: TableFiltersConfig<any>[];
    onCopy?: (copyFrom: DataTableSelectedCellData<TItem, TId, TFilter>, selectedCells: DataTableSelectedCellData<TItem, TId, TFilter>[]) => void;
    renderColumnsConfigurationModal?: (props: ColumnsConfigurationModalProps<TItem, TId, TFilter>) => React.ReactNode;
}

export function DataTable<TItem, TId>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) {
    const { uuiModals } = useUuiContext();
    const headerRef = React.useRef<HTMLDivElement>();
    const columnsWithFilters = useColumnsWithFilters(props.columns, props.filters);
    const { columns, config, defaultConfig } = useColumnsConfig(columnsWithFilters, props.value?.columnsConfig);

    const defaultRenderRow = React.useCallback((rowProps: DataRowProps<TItem, TId> & DataTableRowMods) => {
        return <DataTableRow key={ rowProps.rowKey } size={ props.size } borderBottom={ props.border } { ...rowProps } cx={ css.cell } />;
    }, []);

    const renderRow = (row: DataRowProps<TItem, TId>) => (props.renderRow ?? defaultRenderRow)({ ...row, columns });
    const rows = props.getRows();

    const renderNoResultsBlock = React.useCallback(() => {
        return (
            <div className={ css.noResults }>
                {props.renderNoResultsBlock ? (
                    props.renderNoResultsBlock?.()
                ) : (
                    <>
                        <IconContainer cx={ css.noResultsIcon } icon={ EmptyTableIcon } />
                        <Text cx={ css.noResultsTitle } fontSize="24" lineHeight="30" color="primary" font="semibold">
                            {i18n.tables.noResultsBlock.title}
                        </Text>
                        <Text fontSize="16" lineHeight="24" font="regular" color="primary">
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
                <div className={ css.stickyHeader } ref={ headerRef }>
                    <DataTableHeaderRow
                        columns={ columns }
                        onConfigButtonClick={ props.showColumnsConfig && onConfigurationButtonClick }
                        selectAll={ props.selectAll }
                        size={ props.size }
                        textCase={ props.headerTextCase }
                        allowColumnsReordering={ props.allowColumnsReordering }
                        allowColumnsResizing={ props.allowColumnsResizing }
                        value={ { ...props.value, columnsConfig: config } }
                        onValueChange={ props.onValueChange }
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
                <Blocker isEnabled={ props.isReloading } />
            </>
        ),
        [
            props, columns, rows, renderNoResultsBlock, onConfigurationButtonClick,
        ],
    );

    return (
        <DataTableSelectionProvider onCopy={ props.onCopy } rows={ rows } columns={ columns }>
            <VirtualList
                value={ props.value }
                onValueChange={ props.onValueChange }
                onScroll={ props.onScroll }
                rowsCount={ props.rowsCount }
                renderRows={ renderRowsContainer }
                cx={ cx(css.table) }
                disableScroll={ props.isReloading }
                rowsSelector="[role=row]"
                rawProps={ {
                    role: 'table',
                    'aria-colcount': columns.length,
                    'aria-rowcount': props.rowsCount,
                } }
            />
        </DataTableSelectionProvider>
    );
}
