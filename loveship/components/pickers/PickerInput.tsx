import React from 'react';
import { DataRowProps, IDropdownToggler, IEditableDebouncer, isMobile, uuiMarkers } from '@epam/uui';
import { DropdownBodyProps, PickerInputBase, PickerTogglerProps } from '@epam/uui-components';
import { DataPickerBody } from './DataPickerBody';
import { PickerModal } from './PickerModal';
import { Panel } from '../layout';
import { PickerInputMods, PickerToggler } from './PickerToggler';
import { DataPickerRow } from './DataPickerRow';
import { PickerItem } from './PickerItem';
import { DataPickerFooter } from './DataPickerFooter';
import { MobileDropdownWrapper } from './MobileDropdownWrapper';
import { SizeMod, EditMode } from '../types';
import * as css from './PickerInput.scss';

export type PickerInputProps = SizeMod & EditMode & {};

const pickerHeight = 300;
const pickerWidth = 360;

export class PickerInput<TItem, TId> extends PickerInputBase<TItem, TId, PickerInputProps> {
    toggleModalOpening(opened: boolean) {
        this.context.uuiModals.show<TId | TId[]>(props => <PickerModal<TItem, TId>
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
                rawProps={ { 'aria-selected': rowProps.isSelectable && rowProps.isSelected, role: 'option' } }
                borderBottom='none'
                size={ this.getRowSize() }
                padding={ this.props.editMode === 'modal' ? '24' : '12' }
                renderItem={ this.renderItem }
            />
        );
    }

    getTogglerProps(rows: DataRowProps<TItem, TId>[]): PickerTogglerProps<TItem, TId> & PickerInputMods {
        return {
            ...super.getTogglerProps(rows),
            size: this.props.size,
            mode: this.props.mode,
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
                    onValueChange: (nV) => this.setState({
                        showSelected: nV,
                        dataSourceState: { ...this.state.dataSourceState },
                    }),
                },
            })
            : (
                <DataPickerFooter
                    isSingleSelect={ this.isSingleSelect() }
                    switchValue={ this.state.showSelected }
                    size={ this.props.size }
                    onSwitchValueChange={ (nV) => this.setState({
                        showSelected: nV,
                        dataSourceState: { ...this.state.dataSourceState },
                    }) }
                    hasSelection={ view.getSelectedRows().length > 0 }
                    clearSelection={ this.clearSelection }
                    selectAll={ view.selectAll }
                />
            );
    }

    renderTarget(dropdownProps: IDropdownToggler) {
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
        const renderedDataRows = rows.map((props: DataRowProps<TItem, TId>) => this.renderRow({ ...props }));

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
                    />
                    { this.renderFooter() }
                </MobileDropdownWrapper>
            </Panel>
        );
    }
}
