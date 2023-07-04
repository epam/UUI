import * as React from 'react';
import { renderSnapshotWithContextAsync, renderWithContextAsync, fireEvent, screen } from '@epam/uui-test-utils';
import { DatePickerBody } from '../DatePickerBody';
import dayjs from 'dayjs';

describe('DataPicker', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DatePickerBody
                value={ null }
                setDisplayedDateAndView={ jest.fn }
                setSelectedDate={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should change selectedDate on day click', async () => {
        const handleChange = jest.fn();
        await renderWithContextAsync(
            <DatePickerBody
                value={ {
                    view: 'DAY_SELECTION',
                    selectedDate: '',
                    displayedDate: dayjs('2017-01-22').startOf('day'),
                } }
                setSelectedDate={ handleChange }
                setDisplayedDateAndView={ jest.fn() }
            />,
        );

        const nextDayElement = screen.queryByText('23');
        fireEvent.click(nextDayElement);
        expect(handleChange).toBeCalledWith('2017-01-23');
    });
});
