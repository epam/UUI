import React, { PropsWithChildren } from 'react';
import { isMobile, Overwrite, PickerFooterProps } from '@epam/uui-core';
import { i18n } from '../../i18n';
import { Switch } from '../inputs';
import { FlexCell, FlexRow, FlexSpacer } from '../layout';
import { LinkButton } from '../buttons';
import type { SizeMod } from '../types';
import { settings } from '../../settings';

import './DataPickerFooter.module.scss';

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

    const size = isMobile() ? settings.pickerInput.sizes.body.mobileFooterLinkButton : props.size;
    const hasSelection = view.getSelectedRowsCount() > 0;
    const rowsCount = view.getListProps().rowsCount;

    const isSinglePicker = selectionMode === 'single';

    const clearAllText = i18n.pickerInput.clearSelectionButton;
    const clearSingleText = i18n.pickerInput.clearSelectionButtonSingle;
    const selectAllText = i18n.pickerInput.selectAllButton;

    const isSearching = search?.length;
    const hideFooter = (rowsCount === 0 && !hasSelection) || isSearching || (isSinglePicker && props.disableClear);

    const showClear = !props.disableClear && (isSinglePicker ? true : (!view.selectAll || hasSelection));

    return !hideFooter && (
        <FlexRow cx="uui-picker_input-footer">
            {!isSinglePicker && !isSearchTooShort && ( // Show this switch only for multi mode and when some rows rendered
                <Switch
                    size={ settings.pickerInput.sizes.body.footerSwitchMap[props.size] }
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
                        key="SelectAll/ClearAll" // We use the same key for these buttons, because we need to leave focus on it after click, so we need to react doesn't remount it.
                        size={ size }
                        caption={ selectAllText }
                        onClick={ () => view.selectAll.onValueChange(true) }
                    />
                )}
                { showClear && (
                    <LinkButton
                        key="SelectAll/ClearAll" // We use the same key for these buttons, because we need to leave focus on it after click, so we need to react doesn't remount it. Basically it's the same button, but with different caption.
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
