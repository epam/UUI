import React from 'react';
import { withMods } from '@epam/uui-core';
import { RangeDatePicker as UuiRangeDatePicker, RangeDatePickerProps } from '@epam/uui';

export const RangeDatePicker = withMods<RangeDatePickerProps>(
    UuiRangeDatePicker, () => {},
    (props) => ({
        inputCx: [props.inputCx, 'uui-theme-promo'],
        bodyCx: [props.bodyCx, 'uui-theme-promo'],
    }),
);
