import * as React from 'react';
import { DataRowProps, IEditableDebouncer } from '@epam/uui';
import { Dropdown, DropdownBodyProps, PickerInputBase, PickerTogglerProps } from '@epam/uui-components';
import { DataPickerInputBody } from './DataPickerInputBody';
import { PickerModal } from './PickerModal';
import { Panel } from '../layout/FlexItems';
import { PickerToggler, PickerTogglerMods } from './PickerToggler';
import { DataPickerRow } from './DataPickerRow';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { PickerItem } from './PickerItem';

export type PickerInputProps =  SizeMod & IHasEditMode & {};

const pickerHeight = 300;
const pickerWidth = 360;

export class PickerInput<TItem, TId> extends PickerInputBase<TItem, TId, PickerInputProps> {

    toggleModalOpening(opened: boolean) {
        this.context.uuiModals.show(props => <PickerModal<TItem, TId>
            { ...this.props }
            { ...props }
            caption={ this.getPlaceholder() }
            initialValue={ this.props.value as any }
            renderRow={ this.renderRow }
            selectionMode={ this.props.selectionMode as any }
            valueType={ this.props.valueType as any }
        />)
            .then(newSelection => this.handleSelectionValueChange(newSelection))
            .catch(() => null);
    }

    getRowSize() {
        return this.props.editMode === 'modal' ? '36' : this.props.size;
    }

    renderItem = (item: TItem, rowProps: DataRowProps<TItem, TId>) => {
        return <PickerItem title={ this.getName(item) } size={ this.getRowSize() } { ...rowProps } />;
    }

    renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        if (rowProps.isSelectable && this.isSingleSelect() && this.props.editMode !== 'modal') {
            rowProps.onSelect = this.onSelect;
        }

        return this.props.renderRow ? this.props.renderRow(rowProps) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                borderBottom='none'
                size={ this.getRowSize() }
                padding={ this.props.editMode === 'modal' ? '24' : '12' }
                renderItem={ this.renderItem }
            />
        );
    }

    getTogglerProps(rows: DataRowProps<TItem, TId>[]): PickerTogglerProps<TItem, TId> & PickerTogglerMods {
        return {
            ...super.getTogglerProps(rows),
            size: this.props.size as PickerTogglerMods['size'],
            mode: this.props.mode ? this.props.mode : EditMode.FORM,
        };
    }

    render() {
        const rows = this.getRows();
        const renderedDataRows = rows.map((props: DataRowProps<TItem, TId>) => this.renderRow(props));
        const renderTarget = this.props.renderToggler || (props => <PickerToggler { ...props } />);

        let maxHeight = this.props.dropdownHeight || pickerHeight;
        let minBodyWidth = this.props.minBodyWidth || pickerWidth;
        const view = this.getView();

        return (
            <Dropdown
                renderTarget={ dropdownProps =>
                    <IEditableDebouncer
                        value={ this.state.dataSourceState.search }
                        onValueChange={ this.handleTogglerSearchChange }
                        render={ editableProps => renderTarget({ ...this.getTogglerProps(rows), ...dropdownProps, ...editableProps }) }
                    />
                }
                renderBody={ (props: DropdownBodyProps) => <Panel shadow style={ { width: props.togglerWidth > minBodyWidth ? props.togglerWidth : minBodyWidth } }>
                    <DataPickerInputBody
                        { ...this.getListProps() }
                        value={ this.getDataSourceState() }
                        onValueChange={ this.handleDataSourceValueChange }
                        search={ this.lens.prop('dataSourceState').prop('search').toProps() }
                        rows={ renderedDataRows }
                        showSearch={ this.getSearchPosition() === 'body' }
                        showSelectedRows={ false }
                        maxHeight={ maxHeight }
                        renderNotFound={ this.props.renderNotFound && (() => this.props.renderNotFound({
                            search: this.state.dataSourceState.search,
                            onClose: () => this.toggleBodyOpening(false),
                        })) }
                        onKeyDown={ (e: React.KeyboardEvent<HTMLElement>) => this.handlePickerInputKeyboard(rows, e) }
                        scheduleUpdate={ props.scheduleUpdate }
                        searchSize={ this.props.size }
                        editMode={ 'dropdown' }
                        isSingleSelect={ this.isSingleSelect() }
                        size={ this.props.size }
                        hasSelection={ view.getSelectedRows().length > 0 }
                        clearSelection={ this.clearSelection }
                        switchValue={ this.state.showSelected }
                        onSwitchValueChange={ (nV) => this.setState({ showSelected: nV }) }
                        selectAll={ view.selectAll }
                        title={ this.props.entityName }
                        close={ () => this.toggleBodyOpening(false) }
                    />
                </Panel> }
                value={ this.shouldShowBody() }
                onValueChange={ !this.props.isDisabled && this.toggleBodyOpening }
                placement={ this.props.dropdownPlacement }
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            />
        );
    }
}
