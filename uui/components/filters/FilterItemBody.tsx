import React from 'react';
import { FilterPickerBody } from './FilterPickerBody.fn';
// import { FilterPickerBody } from './FilterPickerBody';
import { FilterDataPickerBody } from './FilterDataPickerBody';
import { FilterRangeDatePickerBody } from './FilterRangeDatePickerBody';
import { IFilterItemBodyProps } from '@epam/uui-core';
import { FilterNumericBody } from './FilterNumericBody';

export function FilterItemBody(props: IFilterItemBodyProps<any>) {
    switch (props.type) {
        case 'singlePicker':
            return <FilterPickerBody { ...props } selectionMode="single" valueType="id" />;
        case 'numeric':
            return <FilterNumericBody { ...props } />;
        case 'multiPicker':
            return <FilterPickerBody { ...props } selectionMode="multi" valueType="id" />;
        case 'datePicker':
            return <FilterDataPickerBody { ...props } format={ props.format || 'DD/MM/YYYY' } />;
        case 'rangeDatePicker':
            return <FilterRangeDatePickerBody { ...props } format={ props.format || 'DD/MM/YYYY' } value={ props.value || { from: null, to: null } } />;
    }
}
