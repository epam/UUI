import * as React from 'react';
import cx from 'classnames';
import { DataRowProps, IEditableDebouncer, uuiMarkers } from '@epam/uui';
import { Dropdown, DropdownBodyProps, PickerInputBase, PickerTogglerProps } from '@epam/uui-components';
import { DataPickerBody } from './DataPickerBody';
import { PickerModal } from './PickerModal';
import { Panel, FlexSpacer } from '../layout/FlexItems';
import { PickerToggler, PickerTogglerMods } from './PickerToggler';
import { DataPickerRow } from './DataPickerRow';
import { Switch } from '../inputs';
import { LinkButton } from '../buttons';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { PickerItem } from './PickerItem';
import { i18n } from '../../i18n';
import * as css from './PickerInput.scss';

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

    renderFooter() {
        if (this.isSingleSelect()) {
            return;
        }

        const view = this.getView();
        const hasSelection = view.getSelectedRows().length > 0;
        const isNotDisabled = hasSelection && !this.isSingleSelect();
        const switchSize = this.props.size === '24' ? '12' : (this.props.size === '42' || this.props.size === '48') ? '24' : '18';

        return <div className={ cx(css.footerWrapper, css[`footer-size-${ this.props.size || 36 }`], uuiMarkers.clickable) }>
            <Switch
                size={ switchSize }
                value={ this.state.showSelected }
                isDisabled={ !isNotDisabled }
                onValueChange={ (nV) => this.setState({ showSelected: nV }) }
                label={ i18n.pickerInput.showOnlySelectedLabel }
            />
            <FlexSpacer />
            { view.selectAll && <LinkButton
                size={ +this.props.size < 36 ? '30' : '36' }
                caption={ hasSelection ? i18n.pickerInput.clearSelectionButton : i18n.pickerInput.selectAllButton }
                onClick={ hasSelection ? () => this.clearSelection() : () => view.selectAll.onValueChange(true) }
            /> }
        </div>;
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
                    <DataPickerBody
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
                    />
                    { this.renderFooter() }
                </Panel> }
                value={ this.shouldShowBody() }
                onValueChange={ !this.props.isDisabled && this.toggleBodyOpening }
                placement={ this.props.dropdownPlacement }
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            />
        );
    }
}
