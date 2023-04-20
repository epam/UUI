import React, { PropsWithChildren } from 'react';
import { isMobile, PickerFooterProps } from '@epam/uui-core';
import { i18n } from '../../i18n';
import { Switch } from '../inputs';
import { FlexCell, FlexRow, FlexSpacer } from '../layout';
import { LinkButton } from '../buttons';
import { SizeMod } from '../types';
import cx from 'classnames';
import css from './DataPickerFooter.scss';

type DataPickerFooterProps<TItem, TId> = PickerFooterProps<TItem, TId> &
SizeMod & {
    hideShowOnlySelected?: boolean;
    type?: string;
};

const switchSizes = {
    24: '12',
    36: '18',
    42: '24',
    48: '24',
} as const;

function DataPickerFooterImpl<TItem, TId>(props: PropsWithChildren<DataPickerFooterProps<TItem, TId>>) {
    const {
        clearSelection,
        view,
        showSelected,
        type,
    } = props;
    const size = isMobile() ? '48' : props.size || '36';
    const switchSize = switchSizes[size as unknown as (keyof typeof switchSizes)];
    const hasSelection = view.getSelectedRowsCount() > 0;

    const isSinglePicker = type === 'singlePicker';

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!e.shiftKey && e.key === 'Tab') e.preventDefault();
    };

    return (
        <FlexRow padding="12" cx={ cx(css.footerWrapper) }>
            {!props.hideShowOnlySelected && (
                <Switch
                    size={ switchSize }
                    value={ showSelected.value }
                    isDisabled={ !hasSelection }
                    onValueChange={ showSelected.onValueChange }
                    label={ i18n.pickerInput.showOnlySelectedLabel }
                />
            )}

            <FlexSpacer />

            {view.selectAll && (
                <FlexCell width="auto" alignSelf="center">
                    <LinkButton
                        size={ size }
                        caption={ hasSelection ? i18n.pickerInput.clearSelectionButton : i18n.pickerInput.selectAllButton }
                        onClick={ hasSelection ? clearSelection : () => view.selectAll.onValueChange(true) }
                        rawProps={ { onKeyDown: handleKeyDown } }
                    />
                </FlexCell>
            )}

            {isSinglePicker && (
                <FlexCell width="auto" alignSelf="center">
                    <LinkButton
                        isDisabled={ !hasSelection }
                        size={ size }
                        caption={ i18n.pickerInput.clearSelectionButtonSingle }
                        onClick={ clearSelection }
                        rawProps={ { onKeyDown: handleKeyDown } }
                    />
                </FlexCell>
            )}
        </FlexRow>
    );
}

export const DataPickerFooter = React.memo(DataPickerFooterImpl);
