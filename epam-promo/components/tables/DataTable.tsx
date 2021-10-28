import * as React from 'react';
import {
    ColumnsConfig, DataRowProps, ScrollManager, DataColumnProps, IEditable, DataTableState, DataSourceListProps,
    DataTableColumnsConfigOptions, useUuiContext, useColumnsConfig,
} from '@epam/uui';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableScrollRow, DataTableMods } from './';
import { FlexRow, VirtualList } from '../';
import * as css from './DataTable.scss';
import * as CustomScrollBars from "react-custom-scrollbars-2";
import { useState } from 'react';

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: CustomScrollBars.positionValues): void;
    showColumnsConfig?: boolean;
}

export const DataTable = <TItem, TId = any>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>): React.ReactElement => {
    const [scrollManager] = useState(new ScrollManager());
    const context = useUuiContext();
    const setColumnsConfig = (config: ColumnsConfig) => {
        props.onValueChange({ ...props.value, columnsConfig: config });
    };

    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, props.value.columnsConfig);

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            borderBottom={ props.border }
            { ...rowProps }
        />
    );


    const getRows = () => {
        const renderItemRow = props.renderRow || renderRow;

        return props.getRows()
            .map((row: DataRowProps<TItem, TId>) => renderItemRow({ ...row, scrollManager: scrollManager, columns: columns }));
    };

    const renderNoResultsBlock = () => {
        // need default behavior

        return props.renderNoResultsBlock ? props.renderNoResultsBlock() : undefined;
    };

    const onConfigurationButtonClick = () => {
        context.uuiModals.show<ColumnsConfig>(modalProps => (
                <ColumnsConfigurationModal
                    { ...modalProps }
                    columns={ props.columns }
                    columnsConfig={ config }
                    defaultConfig={ defaultConfig }
                />
            ))
            .then(setColumnsConfig)
            .catch(() => null);
    };

    return (
        <>
            <DataTableHeaderRow
                key='header'
                scrollManager={ scrollManager }
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
            <FlexRow
                key='body'
                topShadow
                background='white'
                cx={ css.body }
            >
                { props.exactRowsCount !== 0 ? (
                    <VirtualList
                        value={ props.value }
                        onValueChange={ props.onValueChange }
                        onScroll={ props.onScroll }
                        rows={ getRows() }
                        rowsCount={ props.rowsCount }
                        focusedIndex={ props.value?.focusedIndex }
                        shadow='dark'
                    />
                    ) : renderNoResultsBlock() }
            </FlexRow>
            <DataTableScrollRow key='scroll' scrollManager={ scrollManager } columns={ columns }/>
        </>
    );
};
