import React from 'react';
import { FlexRow, FlexSpacer, FlexCell } from '../layout';
import { i18n } from '../../i18n';
import { FilterRangeDatePickerBodyFooterProps } from '@epam/uui-core';
import { RangeDatePickerInput } from '../datePickers';
import { settings } from '../../settings';
import { LinkButton } from '../buttons';
import './FilterRangeDatePickerBodyFooter.module.scss';

const UUI_FILTERS_PANEL_RDTP_FOOTER = 'uui-filters-panel-rdtp-footer';

export function FilterRangeDatePickerBodyFooter(props: FilterRangeDatePickerBodyFooterProps) {
    const shouldShowClearButton = (!props.preventEmptyToDate || !props.preventEmptyFromDate) && !props.disableClear;

    return (
        <FlexCell alignSelf="stretch">
            <FlexRow
                cx={ UUI_FILTERS_PANEL_RDTP_FOOTER }
            >
                <RangeDatePickerInput
                    size={ settings.filtersPanel.sizes.rangeDatePickerInput }
                    disableClear={ props.disableClear }
                    inFocus={ props.inFocus }
                    format={ props.format }
                    value={ props.value }
                    onValueChange={ props.onValueChange }
                    onFocusInput={ (event, inputType) => {
                        if (props.onFocus) {
                            props.onFocus(event, inputType);
                        }
                        props.setInFocus(inputType);
                    } }
                    onBlurInput={ props.onBlur }
                    preventEmptyFromDate={ props.preventEmptyFromDate }
                    preventEmptyToDate={ props.preventEmptyToDate }
                />
                <FlexSpacer />
                { shouldShowClearButton && (
                    <LinkButton
                        isDisabled={ !props.value.from && !props.value.to }
                        caption={ i18n.filterToolbar.rangeDatePicker.clearCaption }
                        onClick={ props.onClear }
                    />
                ) }
            </FlexRow>
        </FlexCell>
    );
}
