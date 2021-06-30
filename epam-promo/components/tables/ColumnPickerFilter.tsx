import * as React from 'react';
import { PickerBase, PickerBaseProps, PickerBaseState } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui';
import { DataPickerInputBody, DataPickerRow } from '../pickers';
import { Text, TextPlaceholder } from '../typography';

export type PickerFilterProps<TItem, TId> = PickerBaseProps<TItem, TId> & {
    size?: '30' | '36';
    showSearch?: boolean;
};

export interface PickerFilterState extends PickerBaseState { }

const pickerHeight = 300;

export class ColumnPickerFilter<TItem, TId> extends PickerBase<TItem, TId, PickerFilterProps<TItem, TId>, PickerFilterState> {
    renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        return this.props.renderRow ? this.props.renderRow(rowProps) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                borderBottom='none'
                size={ this.props.size || '30' }
                renderItem={ i => <Text size={ this.props.size || '30' }>{ rowProps.isLoading ? <TextPlaceholder wordsCount={ 2 }/> : this.getName(i) }</Text> }
                padding='12'
            />
        );
    }

    render() {
        const view = this.getView();
        const dataRows = view.getVisibleRows();
        const rows = dataRows.map(this.renderRow);

        return <DataPickerInputBody
            { ...view.getListProps() }
            value={ this.getDataSourceState() }
            onValueChange={ this.handleDataSourceValueChange }
            maxHeight={ pickerHeight }
            showSelectedRows={ true }
            rows={ rows }
            search={ this.lens.prop('dataSourceState').prop('search').toProps() }
            showSearch={ this.props.showSearch }
            size={ this.props.size }
            hasSelection={ dataRows.length > 0 }
            clearSelection={ this.clearSelection }
            switchValue={ this.state.showSelected }
            onSwitchValueChange={ (nV) => this.setState({ showSelected: nV }) }
            selectAll={ view.selectAll }
        />;
    }
}
