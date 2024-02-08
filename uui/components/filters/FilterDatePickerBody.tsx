import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import { i18n } from '../../i18n';
import { DatePickerCoreProps, IDropdownBodyProps } from '@epam/uui-core';
import { FlexSpacer, FlexRow, FlexCell } from '../layout';
import { LinkButton } from '../buttons';
import { Text } from '../typography';
import { DatePickerBody } from '../datePickers';
import { useDatePickerState } from '../datePickers/useDatePickerState';

/** Represents the properties of the DatePicker. */
export interface DatePickerProps extends DatePickerCoreProps, IDropdownBodyProps {}

export function FilterDatePickerBody(props: DatePickerProps) {
    const { value } = props;

    const {
        view,
        month,
        onValueChange,
        handleCancel,
        handleToggle,
    } = useDatePickerState({
        ...props,
        onValueChange: (v: string | null) => {
            props.onValueChange(v);
            if (v) {
                handleToggle(false);
                props.onClose?.();
            }
        },
    });

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
                    onValueChange={ onValueChange }
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
                        onClick={ handleCancel }
                    />
                </FlexRow>
            </FlexCell>
        </Fragment>
    );
}
