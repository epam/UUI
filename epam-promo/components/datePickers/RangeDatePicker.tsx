import React from 'react';
import { RangeDatePicker as UuiRangeDatePicker, RangeDatePickerProps, withMods } from "@epam/uui";

export const RangeDatePicker = withMods<RangeDatePickerProps>(
    UuiRangeDatePicker, () => {},
    (props) => ({
        inputCx: [props.inputCx, 'uui-theme-promo'],
        bodyCx: [props.bodyCx, 'uui-theme-promo'],
    }),
);
