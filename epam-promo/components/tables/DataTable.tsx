import * as React from 'react';
import { BaseDataTableProps, BaseDataTable } from '@epam/uui-components';
import { ColumnsConfig, DataRowProps, useUuiContext, useColumnsConfig, cx } from '@epam/uui';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import * as css from './DataTable.scss';

export interface DataTableProps<TItem, TId> extends Exclude<BaseDataTableProps<TItem, TId>, 'renderHeader' | 'onConfigurationButtonClick'> {};

export function DataTable<TItem, TId>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) {
    const { uuiModals } = useUuiContext();
    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, props.value.columnsConfig);

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

    return (
        <BaseDataTable
            cx={ cx(props.cx, css.table, css['shadow-' + (props.shadow || 'dark')]) }
            renderRow={ renderRow }
            renderNoResultsBlock={ renderNoResultsBlock }
            onConfigurationButtonClick={ onConfigurationButtonClick }
            renderHeader={ () => (
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
            )}
            { ...props }
        />
    );
};
