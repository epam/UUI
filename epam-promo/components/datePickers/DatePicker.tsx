import React from 'react';
import { withMods } from '@epam/uui-core';
import { DatePicker as UuiDatePicker, DatePickerProps } from '@epam/uui';

export const DatePicker = withMods<DatePickerProps>(
    UuiDatePicker, () => {},
    (props) => ({
        inputCx: [props.inputCx],
        bodyCx: [props.bodyCx],
    }),
);
