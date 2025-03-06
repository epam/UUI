import React from 'react';
import { DataRowProps, DataSourceState, IHasCaption, PickerBaseOptions } from '@epam/uui-core';
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
import { PickerItem } from './PickerItem';
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
        getDataSourceState,
        getName,
        clearSelection,
        getRows,
        getListProps,
        getFooterProps,
        isSingleSelect,
        handleDataSourceValueChange,
    } = usePickerModal<TItem, TId>(props);

    const getSubtitle = ({ path }: DataRowProps<TItem, TId>, { search }: DataSourceState) => {
        if (!search) return;

        return path
            .map(({ value }) => getName(value))
            .filter(Boolean)
            .join(' / ');
    };

    const renderItem = (item: TItem, rowProps: DataRowProps<TItem, TId>, dsState: DataSourceState) => {
        const { flattenSearchResults } = view.getConfig();
        return (
            <PickerItem
                title={ getName(item) }
                size="36"
                dataSourceState={ dsState }
                { ...(flattenSearchResults ? { subtitle: getSubtitle(rowProps, dataSourceState) } : {}) }
                { ...rowProps }
            />
        );
    };

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        return props.renderRow ? (
            props.renderRow(rowProps, dataSourceState)
        ) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                padding="24"
                size="36"
                renderItem={ (item, itemProps) => renderItem(item, itemProps, dataSourceState) }
            />
        );
    };

    const renderFooter = () => {
        const hasSelection = view.getSelectedRowsCount() > 0;
        const rowsCount = view.getListProps().rowsCount;
        const isEmptyRowsAndHasNoSelection = (rowsCount === 0 && !hasSelection);
        return (
            <>
                {view.selectAll && (
                    <LinkButton
                        caption={ hasSelection ? i18n.pickerModal.clearAllButton : i18n.pickerModal.selectAllButton }
                        onClick={ hasSelection ? () => clearSelection() : () => view.selectAll.onValueChange(true) }
                        isDisabled={ isEmptyRowsAndHasNoSelection }
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
                <Text cx={ css.noFoundModalContainerText } fontWeight="600" fontSize="16" lineHeight="24" color="primary" size="36">
                    {i18n.dataPickerBody.noRecordsMessage}
                </Text>
                <Text cx={ css.noFoundModalContainerText } fontSize="12" lineHeight="18" color="primary" size="36">
                    {i18n.dataPickerBody.noRecordsSubTitle}
                </Text>
            </div>
        );
    };

    const dataRows = getRows();
    const rows = dataRows.map((row) => renderRow(row));

    return (
        <ModalBlocker { ...props }>
            <ModalWindow width={ 600 } height={ 700 }>
                <ModalHeader title={ props.caption || i18n.pickerModal.headerTitle } onClose={ () => props.abort() } />
                <FlexCell cx={ css.subHeaderWrapper }>
                    <FlexRow vPadding="24">
                        <SearchInput
                            { ...dataSourceStateLens.prop('search').toProps() }
                            onKeyDown={ (e) =>
                                handleDataSourceKeyboard(
                                    {
                                        value: getDataSourceState(),
                                        onValueChange: handleDataSourceValueChange,
                                        listView: view,
                                        rows: dataRows,
                                        searchPosition: 'body',
                                    },
                                    e,
                                ) }
                            autoFocus={ true }
                            placeholder={ i18n.pickerModal.searchPlaceholder }
                            rawProps={ { dir: 'auto' } }
                        />
                    </FlexRow>
                    {!isSingleSelect() && (
                        <Switch
                            cx={ css.switch }
                            size="18"
                            { ...getFooterProps().showSelected }
                            isDisabled={ view.getSelectedRowsCount() < 1 }
                            label="Show only selected"
                        />
                    )}
                    {props.renderFilter && <FlexCell grow={ 2 }>{props.renderFilter(dataSourceStateLens.prop('filter').toProps())}</FlexCell>}
                </FlexCell>
                <DataPickerBody
                    { ...getListProps() }
                    value={ getDataSourceState() }
                    onValueChange={ handleDataSourceValueChange }
                    search={ dataSourceStateLens.prop('search').toProps() }
                    showSearch={ false }
                    rows={ rows }
                    renderNotFound={ renderNotFound }
                    editMode="modal"
                />
                <ModalFooter padding="24" vPadding="24">
                    {props.renderFooter ? props.renderFooter(getFooterProps()) : renderFooter()}
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
