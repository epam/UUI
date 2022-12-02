import React from 'react';
import { DatePicker as UuiDatePicker, UuiDatePickerProps, withMods } from "@epam/uui";

export const DatePicker = withMods<UuiDatePickerProps>(
    UuiDatePicker, () => {},
    (props) => ({
        inputCx: [props.inputCx, 'uui-theme-promo'],
        bodyCx: [props.bodyCx, 'uui-theme-promo'],
    }),
);
