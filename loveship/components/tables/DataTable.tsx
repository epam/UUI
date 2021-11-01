import React, { useState } from 'react';
import {
    ColumnsConfig, cx, DataRowProps, ScrollManager, IEditable, DataTableState, DataSourceListProps, DataColumnProps,
    DataTableColumnsConfigOptions, useUuiContext, useColumnsConfig,
} from '@epam/uui';
import type { PositionValues } from "@epam/uui-components";
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableScrollRow, DataTableMods } from './';
import { FlexRow, IconButton, VirtualList, Text } from '../';
import * as css from './DataTable.scss';
import * as searchIcon from '../icons/search-24.svg';

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
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
            background={ props.rowBackground }
            borderBottom={ props.border }
            { ...rowProps }
        />
    );

    const getRows = () => {
        const renderItemRow = props.renderRow || renderRow;

        return props.getRows().map((row: DataRowProps<TItem, TId>) => renderItemRow({
            ...row,
            scrollManager: scrollManager,
            columns: columns,
        }));
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

    const renderNoResultsBlock = () => {
        const renderNoResults = () => (
            <div className={ cx(css.noResults) }>
                <IconButton icon={ searchIcon } cx={ css.noResultsIcon }/>
                <Text fontSize='16' font='sans-semibold'>No Results Found</Text>
                <Text fontSize='14'>We can't find any item matching your request</Text>
            </div>
        );

        return props.renderNoResultsBlock ? props.renderNoResultsBlock() : renderNoResults();
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
                cx={ css.body }>
                { props.exactRowsCount !== 0 ? (
                    <VirtualList
                        value={ props.value }
                        onValueChange={ props.onValueChange }
                        onScroll={ props.onScroll }
                        rows={ getRows() }
                        rowsCount={ props.rowsCount }
                        focusedIndex={ props.value?.focusedIndex }
                    />
                ) : renderNoResultsBlock() }
            </FlexRow>
            <DataTableScrollRow key='scroll' scrollManager={ scrollManager } columns={ columns }/>
        </>
    );
};

