import React from 'react';
import { DataRowProps, IDropdownToggler, IEditableDebouncer, isMobile, uuiMarkers } from '@epam/uui';
import { DropdownBodyProps, PickerInputBase, PickerTogglerProps } from '@epam/uui-components';
import { PickerModal } from './PickerModal';
import { Panel } from '../layout';
import { PickerToggler, PickerTogglerMods } from './PickerToggler';
import { DataPickerRow } from './DataPickerRow';
import { PickerItem } from './PickerItem';
import { DataPickerBody } from './DataPickerBody';
import { DataPickerFooter } from './DataPickerFooter';
import { MobileDropdownWrapper } from './MobileDropdownWrapper';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import css from './PickerInput.scss';

export type PickerInputProps = SizeMod & IHasEditMode & {};

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
            selectionMode={ this.props.selectionMode }
            valueType={ this.props.valueType }
        />)
            .then(newSelection => this.handleSelectionValueChange(newSelection))
            .catch(() => null);
    }

    getRowSize() {
        return isMobile()
            ? '48'
            : this.props.editMode === 'modal'
                ? '36'
                : this.props.size;
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
                rawProps={ { 'aria-selected': rowProps.isSelectable && rowProps.isSelected, role: 'option' } }
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

    renderFooter() {
        const view = this.getView();

        return this.props.renderFooter
            ? this.props.renderFooter({
                ...this.props as any,
                view: view,
                showSelected: {
                    value: this.state.showSelected,
                    onValueChange: (nV) => this.setState({ showSelected: nV, dataSourceState: { ...this.state.dataSourceState } }),
                },
            })
            : (
                <DataPickerFooter
                    isSingleSelect={ this.isSingleSelect() }
                    size={ this.props.size }
                    hasSelection={ view.getSelectedRows().length > 0 }
                    clearSelection={ this.clearSelection }
                    switchValue={ this.state.showSelected }
                    onSwitchValueChange={ (nV) => this.setState({ showSelected: nV }) }
                    selectAll={ view.selectAll }
                />
            );
    }

    renderTarget(dropdownProps: IDropdownToggler): React.ReactNode {
        const rows = this.getRows();
        const renderTarget = this.props.renderToggler || (props => <PickerToggler { ...props } />);

        return (
            <IEditableDebouncer
                value={ this.state.dataSourceState.search }
                onValueChange={ this.handleTogglerSearchChange }
                render={ editableProps => renderTarget({ ...this.getTogglerProps(rows), ...dropdownProps, ...editableProps }) }
            />
        );
    }

    renderBody(props: DropdownBodyProps) {
        const rows = this.getRows();
        const renderedDataRows = rows.map((props: DataRowProps<TItem, TId>) => this.renderRow(props));

        const maxHeight = isMobile()
            ? document.documentElement.clientHeight
            : (this.props.dropdownHeight || pickerHeight);
        const minBodyWidth = isMobile()
            ? document.documentElement.clientWidth 
            : (this.props.minBodyWidth || pickerWidth);
        
        return (
            <Panel
                shadow
                style={ { width: props.togglerWidth > minBodyWidth ? props.togglerWidth : minBodyWidth } }
                rawProps={ { tabIndex: -1 } }
                cx={ [css.panel, uuiMarkers.lockFocus] }
            >
                <MobileDropdownWrapper
                    title={ this.props.entityName }
                    close={ () => this.toggleBodyOpening(false) }
                >
                    <DataPickerBody
                        { ...this.getListProps() }
                        { ...this.getPickerProps() }
                        rows={ renderedDataRows }
                        maxHeight={ maxHeight }
                        onKeyDown={ (e: React.KeyboardEvent<HTMLElement>) => this.handlePickerInputKeyboard(rows, e) }
                        scheduleUpdate={ props.scheduleUpdate }
                        searchSize={ this.props.size }
                        editMode='dropdown'
                    />
                    { this.renderFooter() }
                </MobileDropdownWrapper>
            </Panel>
        );
    }
}
