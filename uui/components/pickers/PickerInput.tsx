import React from 'react';
import { PickerBodyBaseProps, PickerInputBaseProps, PickerTogglerProps, usePickerInput } from '@epam/uui-components';
import { Dropdown } from '../overlays/Dropdown';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { DataRowProps, DataSourceListProps, DataSourceState, DropdownBodyProps, IDropdownToggler, IEditableDebouncer, isMobile } from '@epam/uui-core';
import { PickerModal } from './PickerModal';
import { PickerToggler, PickerTogglerMods } from './PickerToggler';
import { MobileDropdownWrapper } from './MobileDropdownWrapper';
import { DataPickerBody } from './DataPickerBody';
import { DataPickerRow } from './DataPickerRow';
import { DataPickerFooter } from './DataPickerFooter';
import { PickerItem } from './PickerItem';

import css from './PickerInput.module.scss';

const pickerHeight = 300;
const pickerWidth = 360;

export type PickerInputProps = SizeMod & IHasEditMode & {};
export type CompletePickerInputProps<TItem, TId> = PickerInputProps & PickerInputBaseProps<TItem, TId>;

export function PickerInput<TItem, TId>({ highlightSearchMatches = true, ...props }: CompletePickerInputProps<TItem, TId>) {
    const toggleModalOpening = () => {
        const { renderFooter, rawProps, ...restProps } = props;
        context.uuiModals
            .show((modalProps) => (
                <PickerModal<TItem, TId>
                    { ...restProps }
                    rawProps={ rawProps?.body }
                    { ...modalProps }
                    caption={ getPlaceholder() }
                    initialValue={ props.value as any }
                    renderRow={ renderRow }
                    selectionMode={ props.selectionMode }
                    valueType={ props.valueType }
                />
            ))
            .then((newSelection) => {
                handleSelectionValueChange(newSelection);
            })
            .catch(() => {});
    };

    const {
        context,
        popperModifiers,
        getName,
        getPlaceholder,
        handleSelectionValueChange,
        getTogglerProps,
        getRows,
        handleTogglerSearchChange,
        toggleBodyOpening,
        dataSourceState,
        getFooterProps,
        getPickerBodyProps,
        getListProps,
        shouldShowBody,
        getSearchPosition,
    } = usePickerInput<TItem, TId, CompletePickerInputProps<TItem, TId>>({ ...props, toggleModalOpening });

    const getTogglerMods = (): PickerTogglerMods => {
        return {
            size: props.size as PickerTogglerMods['size'],
            mode: props.mode ? props.mode : EditMode.FORM,
        };
    };

    const renderTarget = (targetProps: IDropdownToggler & PickerTogglerProps<TItem, TId>) => {
        const renderTargetFn = props.renderToggler || ((props) => <PickerToggler { ...props } />);

        return (
            <IEditableDebouncer
                value={ targetProps.value }
                onValueChange={ handleTogglerSearchChange }
                render={ (editableProps) => renderTargetFn({
                    ...getTogglerMods(),
                    ...targetProps,
                    ...editableProps,
                }) }
            />
        );
    };

    const renderFooter = () => {
        const footerProps = getFooterProps();

        return props.renderFooter ? props.renderFooter(footerProps) : <DataPickerFooter { ...footerProps } size={ props.size } />;
    };

    const getRowSize = () => {
        if (isMobile()) {
            return '48';
        }

        return props.editMode === 'modal' ? '36' : props.size;
    };

    const renderItem = (item: TItem, rowProps: DataRowProps<TItem, TId>, dsState: DataSourceState) => {
        return (
            <PickerItem
                title={ getName(item) }
                size={ getRowSize() }
                dataSourceState={ dsState }
                highlightSearchMatches={ highlightSearchMatches }
                { ...rowProps }
            />
        );
    };

    const renderRow = (rowProps: DataRowProps<TItem, TId>, dsState: DataSourceState) => {
        return props.renderRow ? (
            props.renderRow(rowProps, dsState)
        ) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                borderBottom="none"
                size={ getRowSize() }
                padding={ props.editMode === 'modal' ? '24' : '12' }
                renderItem={ (item, itemProps) => renderItem(item, itemProps, dsState) }
            />
        );
    };

    const renderBody = (bodyProps: DropdownBodyProps & DataSourceListProps & Omit<PickerBodyBaseProps, 'rows'>, rows: DataRowProps<TItem, TId>[]) => {
        const renderedDataRows = rows.map((row) => renderRow(row, dataSourceState));
        const bodyHeight = isMobile() ? document.documentElement.clientHeight : props.dropdownHeight || pickerHeight;
        const minBodyWidth = props.minBodyWidth || pickerWidth;

        return (
            <MobileDropdownWrapper
                title={ props.entityName }
                onClose={ () => toggleBodyOpening(false) }
                cx={ [css.panel, props.bodyCx] }
                onKeyDown={ bodyProps.onKeyDown }
                width={ bodyProps.togglerWidth > minBodyWidth ? bodyProps.togglerWidth : minBodyWidth }
                focusLock={ getSearchPosition() === 'body' }
            >
                <DataPickerBody
                    { ...bodyProps }
                    rows={ renderedDataRows }
                    maxHeight={ bodyHeight }
                    searchSize={ props.size }
                    editMode="dropdown"
                    selectionMode={ props.selectionMode }
                    renderNotFound={
                        props.renderNotFound
                            ? () =>
                                props.renderNotFound({
                                    search: dataSourceState.search,
                                    onClose: () => toggleBodyOpening(false),
                                })
                            : undefined
                    }
                />
                { renderFooter() }
            </MobileDropdownWrapper>
        );
    };

    const rows = getRows();

    return (
        <Dropdown
            renderTarget={ (dropdownProps) => {
                const targetProps = getTogglerProps(rows);
                return renderTarget({ ...dropdownProps, ...targetProps });
            } }
            renderBody={ (bodyProps) => renderBody({ ...bodyProps, ...getPickerBodyProps(rows), ...getListProps() }, rows) }
            value={ shouldShowBody() }
            onValueChange={ !props.isDisabled && toggleBodyOpening }
            placement={ props.dropdownPlacement }
            modifiers={ popperModifiers }
            closeBodyOnTogglerHidden={ !isMobile() }
            portalTarget={ props.portalTarget }
        />
    );
}
