import * as React from 'react';
import {applyColumnsConfig, ColumnsConfig, DataRowProps, DataSourceState, Lens, ScrollManager, UuiContexts,
    uuiContextTypes, getColumnsConfig, DataColumnProps, IEditable, DataTableState, DataSourceListProps, DataTableColumnsConfigOptions } from '@epam/uui';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableScrollRow, DataTableMods } from './';
import { FlexRow, VirtualList } from '../';
import * as css from './DataTable.scss';
import * as CustomScrollBars from "react-custom-scrollbars";

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: CustomScrollBars.positionValues): void;
    showColumnsConfig?: boolean;
}

export class DataTable<TItem, TId = any> extends React.Component<DataTableProps<TItem, TId> & DataTableMods, any> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    scrollManager = new ScrollManager();
    lens = Lens.onEditableComponent<DataSourceState>(this);

    getColumns() {
        return applyColumnsConfig(this.props.columns, this.getColumnsConfig());
    }

    setColumnsConfig = (config: ColumnsConfig) => {
        this.props.onValueChange({ ...this.props.value, columnsConfig: config });
    }

    getColumnsConfig() {
        return getColumnsConfig(this.props.columns, this.props.value.columnsConfig);
    }

    getRows() {
        const renderRow = this.props.renderRow || this.renderRow;

        return this.props.getRows()
            .map((row: DataRowProps<TItem, TId>) => renderRow({ ...row, scrollManager: this.scrollManager, columns: this.getColumns() }));
    }

    renderRow = (props: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ props.rowKey }
            size={ this.props.size }
            borderBottom={ this.props.border }
            { ...props }
        />
    )

    onConfigurationButtonClick = () => {
        this.context.uuiModals.show<ColumnsConfig>(modalProps => (
                <ColumnsConfigurationModal
                    { ...modalProps }
                    columns={ this.props.columns }
                    columnsConfig={ this.getColumnsConfig() }
                />
            )).then(this.setColumnsConfig);
    }

    render() {
        return (
            <>
                <DataTableHeaderRow
                    key='header'
                    scrollManager={ this.scrollManager }
                    columns={ this.getColumns() }
                    onConfigButtonClick={ this.props.showColumnsConfig && this.onConfigurationButtonClick }
                    selectAll={ this.props.selectAll }
                    size={ this.props.size }
                    textCase={ this.props.headerTextCase }
                    allowColumnsReordering={ this.props.allowColumnsReordering }
                    allowColumnsResizing={ this.props.allowColumnsResizing }
                    { ...this.lens.toProps() }
                />
                <FlexRow key='body' topShadow background='white' cx={ css.body }>
                    <VirtualList
                        { ...this.lens.toProps() }
                        onScroll={ this.props.onScroll }
                        rows={ this.getRows() }
                        rowsCount={ this.props.rowsCount }
                        focusedIndex={ this.props.value?.focusedIndex }
                        shadow='dark'
                    />
                </FlexRow>
                <DataTableScrollRow key='scroll' scrollManager={ this.scrollManager } columns={ this.getColumns() }/>
            </>
        );
    }
}
