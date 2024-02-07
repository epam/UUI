import React, { Fragment, useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { i18n } from '../../i18n';
import { DatePickerCoreProps, IDropdownBodyProps, useUuiContext } from '@epam/uui-core';
import { FlexSpacer, FlexRow, FlexCell } from '../layout';
import { LinkButton } from '../buttons';
import { Text } from '../typography';
import { DatePickerBody } from '../datePickers';
import { valueFormat, PickerBodyValue, DatePickerState } from '@epam/uui-components';

/** Represents the properties of the DatePicker. */
export interface DatePickerProps extends DatePickerCoreProps, IDropdownBodyProps {}

export function FilterDatePickerBody(props: DatePickerProps) {
    const { value } = props;
    const context = useUuiContext();

    const [state, setState] = useState<DatePickerState>({
        isOpen: false,
        view: 'DAY_SELECTION',
        month: dayjs(value, valueFormat).isValid() ? dayjs(value, valueFormat) : dayjs().startOf('day'),
    });

    const updateState = useCallback((newState: Partial<DatePickerState>) => {
        setState((prev) => ({ ...prev, ...newState }));
    }, [setState]);

    const onValueChange = (newValue: Partial<PickerBodyValue<string>>) => {
        let newState: Partial<PickerBodyValue<string>> = {};

        if (newValue.selectedDate) {
            props.onValueChange(newValue.selectedDate || value);
            handleToggle(false);
            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue.selectedDate, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }

        if (newValue.month) {
            newState = {
                ...newState,
                month: dayjs(newValue.month, valueFormat).isValid()
                    ? dayjs(newValue.month, valueFormat)
                    : dayjs().startOf('day'),
            };
        }
        if (newValue.view) {
            newState = { ...newState, view: newValue.view };
        }
        updateState(newState);
    };

    const handleValueChange = (newValue: string | null) => {
        props.onValueChange(newValue);
        updateState({
            month: dayjs(newValue, valueFormat).isValid() ? dayjs(newValue, valueFormat) : dayjs().startOf('day'),
        });

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleCancel = () => {
        handleValueChange(null);
    };

    const handleToggle = (open: boolean) => {
        if (open) {
            updateState({
                isOpen: open,
                view: 'DAY_SELECTION',
                month: value ? dayjs(value) : dayjs(),
            });
        } else {
            updateState({ isOpen: open });
            props.onBlur?.();
        }
    };

    return (
        <Fragment>
            <FlexRow borderBottom={ true }>
                <DatePickerBody
                    filter={ props.filter }
                    value={ {
                        selectedDate: value,
                        month: state.month,
                        view: state.view,
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
