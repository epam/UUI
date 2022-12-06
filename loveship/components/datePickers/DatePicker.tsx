import React from 'react';
import { withMods, UuiDatePickerProps, DatePicker as UuiDatePicker } from "@epam/uui";

export const DatePicker = withMods<UuiDatePickerProps>(
    UuiDatePicker, () => {},
    (props) => ({
        inputCx: [props.inputCx, 'uui-theme-loveship'],
        bodyCx: [props.bodyCx, 'uui-theme-loveship'],
    }),
);