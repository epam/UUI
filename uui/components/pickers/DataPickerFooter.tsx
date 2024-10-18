import React, { PropsWithChildren } from 'react';
import { isMobile, Overwrite, PickerFooterProps } from '@epam/uui-core';
import { i18n } from '../../i18n';
import { Switch, SwitchProps } from '../inputs';
import { FlexCell, FlexRow, FlexSpacer } from '../layout';
import { LinkButton, LinkButtonProps } from '../buttons';
import { SizeMod } from '../types';
import { settings } from '../../settings';
import css from './DataPickerFooter.module.scss';

export interface DataPickerFooterModsOverride {
}

interface DataPickerFooterMods extends SizeMod {
}

export type DataPickerFooterProps<TItem, TId> = Overwrite<DataPickerFooterMods, DataPickerFooterModsOverride> & PickerFooterProps<TItem, TId> & {
    selectionMode: 'single' | 'multi';
};

function DataPickerFooterImpl<TItem, TId>(props: PropsWithChildren<DataPickerFooterProps<TItem, TId>>) {
    const {
        search,
        clearSelection,
        view,
        showSelected,
        selectionMode,
        isSearchTooShort,
    } = props;

    const size = isMobile() ? settings.sizes.pickerInput.body.mobile.footer.linkButton as LinkButtonProps['size'] : props.size;
    const hasSelection = view.getSelectedRowsCount() > 0;
    const rowsCount = view.getListProps().rowsCount;

    const isSinglePicker = selectionMode === 'single';

    const clearAllText = i18n.pickerInput.clearSelectionButton;
    const clearSingleText = i18n.pickerInput.clearSelectionButtonSingle;
    const selectAllText = i18n.pickerInput.selectAllButton;

    const isSearching = search?.length;
    const hideFooter = isSearchTooShort || rowsCount === 0 || isSearching || (isSinglePicker && props.disableClear);

    const showClear = !props.disableClear && (isSinglePicker ? true : (!view.selectAll || hasSelection));

    return !hideFooter && (
        <FlexRow cx={ css.footer }>
            {!isSinglePicker && (
                <Switch
                    size={ settings.sizes.pickerInput.body.dropdown.footer.switch[props.size] as SwitchProps['size'] }
                    value={ showSelected.value }
                    isDisabled={ !hasSelection }
                    onValueChange={ showSelected.onValueChange }
                    label={ i18n.pickerInput.showOnlySelectedLabel }
                />
            )}

            <FlexSpacer />

            <FlexCell width="auto" alignSelf="center">
                {view.selectAll && !hasSelection && (
                    <LinkButton
                        size={ size }
                        caption={ selectAllText }
                        onClick={ () => view.selectAll.onValueChange(true) }
                    />
                )}
                { showClear && (
                    <LinkButton
                        size={ size }
                        caption={ isSinglePicker ? clearSingleText : clearAllText }
                        onClick={ clearSelection }
                        isDisabled={ !hasSelection }
                    />
                )}
            </FlexCell>
        </FlexRow>
    );
}

export const DataPickerFooter = React.memo(DataPickerFooterImpl);
