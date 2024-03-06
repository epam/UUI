import React, {
    Fragment, useEffect, useState,
} from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { i18n } from '../../i18n';
import { IDropdownBodyProps, useUuiContext } from '@epam/uui-core';
import {
    FlexSpacer, FlexRow, FlexCell,
} from '../layout';
import { LinkButton } from '../buttons';
import { Text } from '../typography';
import {
    DatePickerBody, DatePickerProps, DatePickerBodyValue, ViewType,
} from '../datePickers';
import { getNewMonth } from '../datePickers/helpers';

/**
 * Represents the properties of the FiterDatePicker
 */
export interface FilterDatePickerProps extends DatePickerProps, IDropdownBodyProps {}

export function FilterDatePickerBody(props: FilterDatePickerProps) {
    const { value } = props;
    const context = useUuiContext();

    const [{
        view,
        month,
    }, setState] = useState<{
        month: Dayjs;
        view: ViewType;
    }>({
        view: 'DAY_SELECTION',
        month: getNewMonth(value),
    });

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            month: getNewMonth(value),
        }));
    }, [value]);

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

    const handleBodyChange = (newValue: DatePickerBodyValue<string>) => {
        if (newValue.selectedDate && value !== newValue.selectedDate) {
            handleValueChange(newValue.selectedDate);
        }

        setState({
            month: getNewMonth(newValue.month),
            view: newValue.view,
        });
    };

    return (
        <Fragment>
            <FlexRow borderBottom={ true }>
                <DatePickerBody
                    filter={ props.filter }
                    value={ {
                        selectedDate: value,
                        month,
                        view,
                    } }
                    onValueChange={ handleBodyChange }
                    renderDay={ props.renderDay }
                    isHoliday={ props.isHoliday }
                    rawProps={ props.rawProps?.body }
                />
            </FlexRow>
            <FlexCell alignSelf="stretch">
                <FlexRow padding="24" vPadding="12">
                    <Text>{value ? dayjs(value).format('MMM DD, YYYY') : ''}</Text>
                    <FlexSpacer />
                    <LinkButton
                        isDisabled={ !value }
                        caption={ i18n.filterToolbar.datePicker.clearCaption }
                        onClick={ () => {
                            handleValueChange(null);
                        } }
                    />
                </FlexRow>
            </FlexCell>
        </Fragment>
    );
}
