import React from 'react';
import { PickerBase, PickerBaseState } from '@epam/uui-components';
import { DataRowProps, isMobile, PickerBaseProps } from '@epam/uui-core';
import { DataPickerBody, DataPickerRow, DataPickerFooter } from '../pickers';
import { Text, TextPlaceholder } from '../typography';

export type PickerFilterProps<TItem, TId> = PickerBaseProps<TItem, TId> & {
    size?: '30' | '36';
    showSearch?: boolean;
};

export interface PickerFilterState extends PickerBaseState {}

const pickerHeight = 300;

export class ColumnPickerFilter<TItem, TId> extends PickerBase<TItem, TId, PickerFilterProps<TItem, TId>, PickerFilterState> {

    renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        return this.props.renderRow ? this.props.renderRow(rowProps) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                borderBottom="none"
                size={ this.props.size || '30' }
                renderItem={ i => (
                    <Text size={ this.props.size || '30' }>
                        { rowProps.isLoading
                            ? <TextPlaceholder wordsCount={ 2 }/>
                            : this.getName(i) }
                    </Text>
                ) }
            />
        );
    }

    getRows() {
        const view = this.getView();

        if (this.state.showSelected) {
            const topIndex = this.state.dataSourceState.topIndex;
            return view.getSelectedRows().slice(topIndex, topIndex + this.state.dataSourceState.visibleCount);
        } else {
            return view.getVisibleRows();
        }
    }

    render() {
        const view = this.getView();
        const renderedDataRows = this.getRows().map(this.renderRow);
        const maxHeight = isMobile() ? document.documentElement.clientHeight : pickerHeight;

        return (
            <>
                <DataPickerBody
                    { ...view.getListProps() }
                    value={ this.getDataSourceState() }
                    onValueChange={ this.handleDataSourceValueChange }
                    maxHeight={ maxHeight }
                    rows={ renderedDataRows }
                    search={ this.lens.prop('dataSourceState').prop('search').toProps() }
                    showSearch={ this.props.showSearch }
                />
                <DataPickerFooter
                    { ...this.getFooterProps() }
                    size={ this.props.size }
                />
            </>
        );
    }
}
