import * as React from 'react';
import dayjs from 'dayjs';
import { renderToJsdomWithContextAsync, fireEvent } from '@epam/test-utils';
import { DatePickerBody } from '../DatePickerBody';

describe('DatePickerBody', () => {
    it('should change selectedDate on day click', async () => {
        const handleChange = jest.fn();
        const result = await renderToJsdomWithContextAsync(<DatePickerBody
            value={ {
                view: 'DAY_SELECTION',
                selectedDate: '',
                displayedDate: dayjs('2017-01-22').startOf('day'),
            } }
            setSelectedDate={ handleChange }
            setDisplayedDateAndView={ jest.fn() }
        />);

        const nextDayElement = result.queryByText('23');
        fireEvent.click(nextDayElement);
        expect(handleChange).toBeCalledWith('2017-01-23');
    });
});
