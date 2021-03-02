import React from 'react';
import {applyColumnsConfig, ColumnsConfig, cx, DataRowProps, DataSourceState, Lens, ScrollManager,
    getColumnsConfig, UuiContexts, uuiContextTypes, IEditable, DataTableState, DataSourceListProps, DataColumnProps} from '@epam/uui';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableScrollRow, DataTableMods } from './';
import { FlexRow, IconButton, VirtualList, Text } from '../';
import * as css from './DataTable.scss';
import * as searchIcon from '../icons/search-24.svg';
import * as CustomScrollBars from "react-custom-scrollbars";

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: CustomScrollBars.positionValues): void;
    showColumnsConfig?: boolean;
}

export class DataTable<TItem, TId = any> extends React.Component<DataTableProps<TItem, TId> & DataTableMods> {

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
            background={ this.props.rowBackground }
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

    renderNoResultsBlock = () => {
        const renderNoResults = () => (
            <div className={ cx(css.noResults) }>
                <IconButton icon={ searchIcon } cx={ css.noResultsIcon } />
                <Text fontSize='16' font='sans-semibold'>No Results Found</Text>
                <Text fontSize='14'>We can't find any item matching your request</Text>
            </div>
        );

        return this.props.renderNoResultsBlock ? this.props.renderNoResultsBlock() : renderNoResults();
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
                    { ...this.lens.toProps() }
                />
                <FlexRow key='body' topShadow background='white' cx={ css.body }>
                    { this.props.exactRowsCount !== 0 ? (
                        <VirtualList
                            { ...this.lens.toProps() }
                            onScroll={ this.props.onScroll }
                            rows={ this.getRows() }
                            rowsCount={ this.props.rowsCount }
                            focusedIndex={ this.props.value.focusedIndex }
                        />
                    ) : this.renderNoResultsBlock() }
                </FlexRow>
                <DataTableScrollRow key='scroll' scrollManager={ this.scrollManager } columns={ this.getColumns() }/>
            </>
        );
    }
}
