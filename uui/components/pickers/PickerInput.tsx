import React from 'react';
import {
    DataRowProps, DataSourceListProps, DropdownBodyProps, IDropdownToggler, IEditableDebouncer, isMobile, uuiMarkers,
} from '@epam/uui-core';
import { PickerBodyBaseProps, PickerInputBase, PickerTogglerProps } from '@epam/uui-components';
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
        const { renderFooter, rawProps, ...restProps } = this.props;
        this.context.uuiModals
            .show((props) => (
                <PickerModal<TItem, TId>
                    { ...restProps }
                    rawProps={ rawProps?.body }
                    { ...props }
                    caption={ this.getPlaceholder() }
                    initialValue={ this.props.value as any }
                    renderRow={ this.renderRow }
                    selectionMode={ this.props.selectionMode }
                    valueType={ this.props.valueType }
                />
            ))
            .then((newSelection) => {
                this.handleSelectionValueChange(newSelection);
                this.returnFocusToInput();
            })
            .catch(() => {
                this.returnFocusToInput();
            });
    }

    getRowSize() {
        return isMobile() ? '48' : this.props.editMode === 'modal' ? '36' : this.props.size;
    }

    renderItem = (item: TItem, rowProps: DataRowProps<TItem, TId>) => {
        return <PickerItem title={ this.getName(item) } size={ this.getRowSize() } { ...rowProps } />;
    };

    renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        return this.props.renderRow ? (
            this.props.renderRow(rowProps, this.state.dataSourceState)
        ) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                borderBottom="none"
                size={ this.getRowSize() }
                padding={ this.props.editMode === 'modal' ? '24' : '12' }
                renderItem={ this.renderItem }
            />
        );
    };

    getTogglerMods(): PickerTogglerMods {
        return {
            size: this.props.size as PickerTogglerMods['size'],
            mode: this.props.mode ? this.props.mode : EditMode.FORM,
        };
    }

    renderFooter() {
        const footerProps = this.getFooterProps();

        return this.props.renderFooter ? (
            this.props.renderFooter(footerProps)
        ) : (
            <DataPickerFooter selectionMode={ this.props?.selectionMode } { ...footerProps } size={ this.props.size } />
        );
    }

    renderTarget(targetProps: IDropdownToggler & PickerTogglerProps<TItem, TId>) {
        const renderTarget = this.props.renderToggler || ((props) => <PickerToggler { ...props } />);

        return (
            <IEditableDebouncer
                value={ targetProps.value }
                onValueChange={ this.handleTogglerSearchChange }
                render={ (editableProps) => renderTarget({ ...this.getTogglerMods(), ...targetProps, ...editableProps }) }
            />
        );
    }

    renderBody(props: DropdownBodyProps & DataSourceListProps & Omit<PickerBodyBaseProps, 'rows'>, rows: DataRowProps<TItem, TId>[]) {
        const renderedDataRows = rows.map((props) => this.renderRow(props));
        const maxHeight = isMobile() ? document.documentElement.clientHeight : this.props.dropdownHeight || pickerHeight;
        const minBodyWidth = isMobile() ? document.documentElement.clientWidth : this.props.minBodyWidth || pickerWidth;

        return (
            <Panel
                style={ { width: props.togglerWidth > minBodyWidth ? props.togglerWidth : minBodyWidth } }
                rawProps={ { tabIndex: -1 } }
                cx={ [
                    css.panel, uuiMarkers.lockFocus, this.props.bodyCx,
                ] }
            >
                <MobileDropdownWrapper
                    title={ this.props.entityName }
                    close={ () => {
                        this.returnFocusToInput();
                        this.toggleBodyOpening(false);
                    } }
                >
                    <DataPickerBody
                        { ...props }
                        rows={ renderedDataRows }
                        maxHeight={ maxHeight }
                        searchSize={ this.props.size }
                        editMode="dropdown"
                        selectionMode={ this.props.selectionMode }
                        renderNotFound={
                            this.props.renderNotFound
                                ? () =>
                                    this.props.renderNotFound({
                                        search: this.state.dataSourceState.search,
                                        onClose: () => this.toggleBodyOpening(false),
                                    })
                                : undefined
                        }
                    />
                    {this.renderFooter()}
                </MobileDropdownWrapper>
            </Panel>
        );
    }
}
