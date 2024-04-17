import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import { i18n } from '../../i18n';
import { IDropdownBodyProps, useUuiContext } from '@epam/uui-core';
import {
    FlexSpacer, FlexRow, FlexCell,
} from '../layout';
import { LinkButton } from '../buttons';
import { Text } from '../typography';
import { DatePickerProps } from '../datePickers';
import { DatePickerBody } from '../datePickers/DatePickerBody';

/**
 * Represents the properties of the FiterDatePicker
 */
export interface FilterDatePickerProps extends DatePickerProps, IDropdownBodyProps {}

export function FilterDatePickerBody(props: FilterDatePickerProps) {
    const { value } = props;
    const context = useUuiContext();

    const handleValueChange = (newValue: string | null) => {
        props.onValueChange(newValue);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
        if (newValue) {
            props.onClose?.();
        }
    };

    const handleBodyChange = (newValue: string) => {
        if (newValue && value !== newValue) {
            handleValueChange(newValue);
        }
    };

    return (
        <Fragment>
            <FlexRow borderBottom={ true }>
                <DatePickerBody
                    filter={ props.filter }
                    value={ value }
                    onValueChange={ handleBodyChange }
                    renderDay={ props.renderDay }
                    isHoliday={ props.isHoliday }
                    rawProps={ props.rawProps?.body }
                />
            </FlexRow>
            <FlexCell alignSelf="stretch">
                <FlexRow
                    padding="24"
                    vPadding="12"
                >
                    <Text>{value ? dayjs(value).format('MMM DD, YYYY') : ''}</Text>
                    <FlexSpacer />
                    <LinkButton
                        isDisabled={ !value }
                        caption={ i18n.filterToolbar.datePicker.clearCaption }
                        onClick={ () => {
                            handleValueChange(undefined); // null is not working with setTableData filters
                        } }
                    />
                </FlexRow>
            </FlexCell>
        </Fragment>
    );
}
