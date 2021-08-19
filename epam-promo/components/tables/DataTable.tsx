import * as React from 'react';
import {
    applyColumnsConfig, ColumnsConfig, DataRowProps, DataSourceState, Lens, ScrollManager, UuiContexts, getColumnsConfig, DataColumnProps, IEditable, DataTableState, DataSourceListProps, DataTableColumnsConfigOptions, UuiContext,
} from '@epam/uui';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableScrollRow, DataTableMods } from './';
import { FlexRow, VirtualList } from '../';
import * as css from './DataTable.scss';
import * as CustomScrollBars from "react-custom-scrollbars-2";

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: CustomScrollBars.positionValues): void;
    showColumnsConfig?: boolean;
}

export class DataTable<TItem, TId = any> extends React.Component<DataTableProps<TItem, TId> & DataTableMods, any> {
    static contextType = UuiContext;
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

    getDefaultColumnsConfig() {
        return getColumnsConfig(this.props.columns, {});
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
                    defaultConfig={ this.getDefaultColumnsConfig() }
                />
            ))
            .then(this.setColumnsConfig)
            .catch(() => null);
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
                <FlexRow
                    key='body'
                    topShadow
                    background='white'
                    cx={ css.body }
                    rawProps={{
                        role: 'table',
                        "aria-rowcount": this.props.rowsCount,
                        "aria-colcount": this.props.columns.length
                    } }>
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
