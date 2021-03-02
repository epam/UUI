import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';
import { PickerBodyValue } from '@epam/uui-components';
import { DatePickerBody } from '../DatePickerBody';

describe('DatePickerBody', () => {
    const value: PickerBodyValue<string> = {
        view: 'DAY_SELECTION',
        displayedDate: moment('2020-01-01'),
        selectedDate: '2020-01-01', //not to be confused with the property value format, here we use the ISO 8601 format "YYYY-MM-DD" - "2020-09-03"
    };

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DatePickerBody
                value={ value }
                setSelectedDate={ jest.fn() }
                setDisplayedDateAndView={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});