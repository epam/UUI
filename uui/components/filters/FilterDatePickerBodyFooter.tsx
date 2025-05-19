import React from 'react';
import { FlexRow, FlexSpacer, FlexCell } from '../layout';
import { LinkButton } from '../buttons';
import { Text } from '../typography';
import { i18n } from '../../i18n';
import { uuiDayjs } from '../../helpers/dayJsHelper';
import { FilterDatePickerBodyFooterProps } from '@epam/uui-core';
import './FilterDatePickerBodyFooter.module.scss';

const UUI_FILTERS_PANEL_DTP_FOOTER = 'uui-filters-panel-dtp-footer';

export function FilterDatePickerBodyFooter({ value, onValueChange }: FilterDatePickerBodyFooterProps) {
    return (
        <FlexCell alignSelf="stretch">
            <FlexRow cx={ UUI_FILTERS_PANEL_DTP_FOOTER }>
                <Text>{value ? uuiDayjs.dayjs(value).format('MMM DD, YYYY') : ''}</Text>
                <FlexSpacer />
                <LinkButton
                    isDisabled={ !value }
                    caption={ i18n.filterToolbar.datePicker.clearCaption }
                    onClick={ () => onValueChange(undefined) }
                />
            </FlexRow>
        </FlexCell>
    );
}
