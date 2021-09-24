import React from 'react';
import css from "./PickerInput.scss";
import { Modifier } from "react-popper";
import { DataRowProps, IEditableDebouncer, isMobile, mobilePopperModifier } from '@epam/uui';
import { Dropdown, DropdownBodyProps, PickerInputBase, PickerTogglerProps } from '@epam/uui-components';
import { PickerModal } from './PickerModal';
import { Panel } from '../layout/FlexItems';
import { PickerToggler, PickerTogglerMods } from './PickerToggler';
import { DataPickerRow } from './DataPickerRow';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { PickerItem } from './PickerItem';
import { DataPickerBody } from "./DataPickerBody";
import { DataPickerFooter } from "./DataPickerFooter";
import { MobileDropdownWrapper } from "./MobileDropdownWrapper";

export type PickerInputProps = SizeMod & IHasEditMode & {};

const pickerHeight = 300;
const pickerWidth = 360;

export class PickerInput<TItem, TId> extends PickerInputBase<TItem, TId, PickerInputProps> {
    private readonly popperModifiers: Modifier<any>[] = [
        {
            name: 'offset',
            options: { offset: [0, 6] },
        },
        mobilePopperModifier,
    ];

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
        return isMobile() 
            ? "48" 
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
                borderBottom="none"
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

    render() {
        const rows = this.getRows();
        const renderedDataRows = rows.map((props: DataRowProps<TItem, TId>) => this.renderRow(props));
        const renderTarget = this.props.renderToggler || (props => <PickerToggler { ...props } />);

        const maxHeight = isMobile()
            ? document.documentElement.clientHeight
            : (this.props.dropdownHeight || pickerHeight);
        const minBodyWidth = isMobile()
            ? document.documentElement.clientWidth 
            : (this.props.minBodyWidth || pickerWidth);
        
        return (
            <Dropdown
                renderTarget={ dropdownProps =>
                    <IEditableDebouncer
                        value={ this.state.dataSourceState.search }
                        onValueChange={ this.handleTogglerSearchChange }
                        render={ editableProps => renderTarget({ ...this.getTogglerProps(rows), ...dropdownProps, ...editableProps }) }
                    />
                }
                renderBody={ (props: DropdownBodyProps) => {
                    return (
                        <Panel
                            shadow
                            style={ { width: props.togglerWidth > minBodyWidth ? props.togglerWidth : minBodyWidth } }
                            cx={ css.panel }
                        >
                            <MobileDropdownWrapper
                                title={ this.props.entityName }
                                close={ () => this.toggleBodyOpening(false) }
                            >
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
                            </MobileDropdownWrapper>
                        </Panel>
                    );
                } }
                value={ this.shouldShowBody() }
                onValueChange={ !this.props.isDisabled && this.toggleBodyOpening }
                placement={ this.props.dropdownPlacement }
                modifiers={ this.popperModifiers }
            />
        );
    }
}
