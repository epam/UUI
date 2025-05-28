import React, { Fragment } from 'react';
import { IDropdownBodyProps, useUuiContext, FilterDatePickerBodyFooterProps, DatePickerFilterConfig } from '@epam/uui-core';
import { FlexRow } from '../layout';
import { DatePickerProps } from '../datePickers';
import { DatePickerBody } from '../datePickers';
import { FilterDatePickerBodyFooter } from './FilterDatePickerBodyFooter';

/**
 * Represents the properties of the FiterDatePicker
 */
export interface FilterDatePickerProps extends
    Omit<DatePickerProps, 'renderFooter'>, IDropdownBodyProps, Pick<DatePickerFilterConfig<any>, 'renderFooter'> {}

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

    function renderFooter() {
        const footerProps: FilterDatePickerBodyFooterProps = {
            value,
            onValueChange: handleValueChange,
        };

        return props.renderFooter ? props.renderFooter(footerProps) : <FilterDatePickerBodyFooter { ...footerProps } />;
    }

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
            { renderFooter() }
        </Fragment>
    );
}
