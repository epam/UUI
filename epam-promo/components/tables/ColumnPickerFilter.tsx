import * as React from 'react';
import { PickerBase, PickerBaseProps, PickerBaseState } from '@epam/uui-components';
import { DataRowProps, isMobile } from '@epam/uui';
import { DataPickerBody, DataPickerFooter, DataPickerRow } from '../pickers';
import { Text, TextPlaceholder } from '../typography';

export type PickerFilterProps<TItem, TId> = PickerBaseProps<TItem, TId> & {
    size?: '30' | '36';
    showSearch?: boolean;
    close?: () => void;
};

export interface PickerFilterState extends PickerBaseState {
}

const pickerHeight = 300;

export class ColumnPickerFilter<TItem, TId> extends PickerBase<TItem, TId, PickerFilterProps<TItem, TId>, PickerFilterState> {
    renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        const size = isMobile() ? "48" : (this.props.size || '30');
        
        return this.props.renderRow ? this.props.renderRow(rowProps) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                borderBottom="none"
                size={ size }
                renderItem={ i => (
                    <Text size={ size }>
                        { rowProps.isLoading
                            ? <TextPlaceholder wordsCount={ 2 }/>
                            : this.getName(i)
                        }
                    </Text>
                ) }
                padding="12"
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
                    { ...this.getListProps() }
                    value={ this.getDataSourceState() }
                    onValueChange={ this.handleDataSourceValueChange }
                    maxHeight={ maxHeight }
                    rows={ renderedDataRows }
                    search={ this.lens.prop('dataSourceState').prop('search').toProps() }
                    showSearch={ this.props.showSearch }
                />
                <DataPickerFooter
                    isSingleSelect={ this.isSingleSelect() }
                    size={ this.props.size }
                    hasSelection={ view.getSelectedRows().length > 0 }
                    clearSelection={ this.clearSelection }
                    switchValue={ this.state.showSelected }
                    onSwitchValueChange={ (nV) => this.setState({ showSelected: nV }) }
                    selectAll={ view.selectAll }
                />
            </>
        );
    }
}
