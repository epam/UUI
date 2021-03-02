import React from "react";
import moment from 'moment';
import renderer from 'react-test-renderer';
import { PickerBodyValue, RangeDatePickerValue } from '@epam/uui-components';
import { RangeDatePickerBody } from '../RangeDatePickerBody';

describe('RangeDatePickerBody', () => {
    const value: PickerBodyValue<RangeDatePickerValue> = {
        view: 'DAY_SELECTION',
        displayedDate: moment('2020-01-01'),
        selectedDate: {
            from: '2020-10-10', // not to be confused with the property value format, here we use the ISO 8601 format "YYYY-MM-DD" - "2020-09-03"
            to: '2020-12-12',
        },
    };

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<RangeDatePickerBody
                value={ value }
                focusPart='from'
                onValueChange={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});