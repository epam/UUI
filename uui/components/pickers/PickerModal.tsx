import React, { useMemo } from 'react';
import { IHasCaption, PickerBaseOptions, PickerRenderRowParams } from '@epam/uui-core';
import { IconContainer, PickerModalArrayProps, PickerModalOptions, PickerModalScalarProps, handleDataSourceKeyboard, usePickerModal } from '@epam/uui-components';
import { DataPickerRow } from './DataPickerRow';
import { Text } from '../typography';
import { FlexRow, FlexCell, FlexSpacer } from '../layout';
import {
    ModalBlocker, ModalWindow, ModalHeader, ModalFooter,
} from '../overlays';
import { LinkButton, Button } from '../buttons';
import { SearchInput, Switch } from '../inputs';
import { DataPickerBody } from './DataPickerBody';
import { i18n } from '../../i18n';
import { settings } from '../../settings';

import css from './PickerModal.module.scss';

export type PickerModalProps<TItem, TId> = PickerBaseOptions<TItem, TId> &
IHasCaption &
(PickerModalScalarProps<TId, TItem> | PickerModalArrayProps<TId, TItem>) &
PickerModalOptions<TItem, TId>;

export function PickerModal<TItem, TId>(props: PickerModalProps<TItem, TId>) {
    const {
        view,
        selection,
        dataSourceStateLens,
        dataSourceState,
        getName,
        clearSelection,
        getRows,
        getListProps,
        getFooterProps,
        isSingleSelect,
        handleDataSourceValueChange,
    } = usePickerModal<TItem, TId>(props);
    const isSearching = dataSourceState.search && dataSourceState.search.length > 0;

    const renderRow = (rowProps: PickerRenderRowParams<TItem, TId>) => {
        return props.renderRow ? (
            props.renderRow(rowProps, dataSourceState)
        ) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                size={ settings.pickerInput.sizes.body.row }
                flattenSearchResults={ view.getConfig().flattenSearchResults }
                dataSourceState={ dataSourceState }
                getName={ getName }
            />
        );
    };

    const renderFooter = () => {
        const hasSelection = view.getSelectedRowsCount() > 0;
        const rowsCount = view.getListProps().rowsCount;
        const isEmptyRowsAndHasNoSelection = (rowsCount === 0 || !hasSelection);
        const showClear = !props.disableClear && (isSingleSelect() ? true : (!view.selectAll || hasSelection));
        const isClearDisabled = isSearching || isEmptyRowsAndHasNoSelection;

        return (
            <>
                {view.selectAll && !hasSelection && (
                    <LinkButton
                        caption={ i18n.pickerModal.selectAllButton }
                        onClick={ () => view.selectAll.onValueChange(true) }
                    />
                )}
                {showClear && (
                    <LinkButton
                        caption={ isSingleSelect() ? i18n.pickerModal.clearButton : i18n.pickerModal.clearAllButton }
                        onClick={ () => clearSelection() }
                        isDisabled={ isClearDisabled }
                    />
                )}
                <FlexSpacer />
                <Button fill="outline" color="secondary" caption={ i18n.pickerModal.cancelButton } onClick={ () => props.abort() } />
                <Button color="primary" caption={ i18n.pickerModal.selectButton } onClick={ () => props.success(selection as any) } />
            </>
        );
    };

    const renderNotFound = () => {
        return props.renderNotFound ? (
            props.renderNotFound({ search: dataSourceState.search, onClose: () => props.success(null) })
        ) : (
            <div className={ css.noFoundModalContainer }>
                <IconContainer cx={ css.noFoundModalContainerIcon } icon={ settings.pickerInput.icons.body.modalNotFoundSearchIcon } />
                <Text cx={ css.noFoundModalContainerText } fontWeight="600" fontSize="16" lineHeight="24" color="primary">
                    {i18n.dataPickerBody.noRecordsMessage}
                </Text>
                <Text cx={ css.noFoundModalContainerText } fontSize="12" lineHeight="18" color="primary">
                    {i18n.dataPickerBody.noRecordsSubTitle}
                </Text>
            </div>
        );
    };

    const dataRows = getRows();

    const focusedRowId = useMemo((): string => {
        const focusedRow = dataRows.find((row) => {
            return row.isFocused;
        });

        if (!focusedRow) {
            return '';
        }

        return focusedRow.rowKey;
    }, [dataRows]);

    return (
        <ModalBlocker { ...props }>
            <ModalWindow width={ 600 } height={ 700 } cx={ css.body }>
                <ModalHeader title={ props.caption || i18n.pickerModal.headerTitle } onClose={ () => props.abort() } />
                <FlexCell cx={ css.subHeaderWrapper }>
                    <FlexRow vPadding="24">
                        <SearchInput
                            { ...dataSourceStateLens.prop('search').toProps() }
                            onKeyDown={ (e) =>
                                handleDataSourceKeyboard(
                                    {
                                        value: dataSourceState,
                                        onValueChange: handleDataSourceValueChange,
                                        listView: view,
                                        rows: dataRows,
                                        searchPosition: 'body',
                                    },
                                    e,
                                ) }
                            autoFocus={ true }
                            placeholder={ i18n.pickerModal.searchPlaceholder }
                            rawProps={ {
                                dir: 'auto',
                                'aria-activedescendant': focusedRowId,
                            } }
                        />
                    </FlexRow>
                    {!isSingleSelect() && (
                        <Switch
                            cx={ css.switch }
                            size={ settings.pickerInput.sizes.body.footerSwitchMap[settings.pickerInput.sizes.body.row] }
                            { ...getFooterProps().showSelected }
                            isDisabled={ isSearching || view.getSelectedRowsCount() < 1 }
                            label="Show only selected"
                        />
                    )}
                    {props.renderFilter && <FlexCell grow={ 2 }>{props.renderFilter(dataSourceStateLens.prop('filter').toProps())}</FlexCell>}
                </FlexCell>
                <DataPickerBody
                    { ...getListProps() }
                    value={ dataSourceState }
                    onValueChange={ handleDataSourceValueChange }
                    showSearch={ false }
                    getName={ getName }
                    rows={ dataRows }
                    renderRow={ renderRow }
                    renderEmpty={ renderNotFound }
                    size={ settings.pickerInput.sizes.body.row }
                />
                <ModalFooter>
                    {props.renderFooter ? props.renderFooter(getFooterProps()) : renderFooter()}
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
