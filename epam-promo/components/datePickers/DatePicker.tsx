import React from 'react';
import { DatePicker as UuiDatePicker, DatePickerProps, withMods } from "@epam/uui";

export const DatePicker = withMods<DatePickerProps>(
    UuiDatePicker, () => {},
    (props) => ({
        inputCx: [props.inputCx, 'uui-theme-promo'],
        bodyCx: [props.bodyCx, 'uui-theme-promo'],
    }),
);
