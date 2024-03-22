import * as React from 'react';
import {
    renderSnapshotWithContextAsync, renderWithContextAsync, fireEvent, screen,
} from '@epam/uui-test-utils';
import { StatelessDatePickerBody } from '../DatePickerBody';
import dayjs, { Dayjs } from 'dayjs';

describe('DataPicker', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <StatelessDatePickerBody
                value={ {
                    view: 'DAY_SELECTION',
                    selectedDate: '',
                    month: dayjs('2017-01-22').startOf('day'),
                } }
                onValueChange={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should change selectedDate on day click', async () => {
        const handleChange = jest.fn();
        await renderWithContextAsync(
            <StatelessDatePickerBody
                value={ {
                    view: 'DAY_SELECTION',
                    selectedDate: '',
                    month: dayjs('2017-01-22').startOf('day'),
                } }
                onValueChange={ handleChange }
            />,
        );

        const nextDayElement = screen.getByText('23');
        fireEvent.click(nextDayElement);
        expect(handleChange).toBeCalledWith({
            month: dayjs('2017-01-22'),
            selectedDate: '2017-01-23',
            view: 'DAY_SELECTION',
        });
    });

    it('should not change selected date if there is filter', async () => {
        const handleChange = jest.fn();
        await renderWithContextAsync(
            <StatelessDatePickerBody
                value={ {
                    view: 'DAY_SELECTION',
                    selectedDate: '2017-01-22',
                    month: dayjs('2017-01-22').startOf('day'),
                } }
                onValueChange={ handleChange }
                filter={ (day: Dayjs) => {
                    return day.valueOf() >= dayjs('2017-01-22').subtract(0, 'day').valueOf();
                } }
            />,
        );

        fireEvent.click(screen.getByText('19'));
        expect(handleChange).not.toHaveBeenCalled();

        fireEvent.click(screen.getByText('25'));
        expect(handleChange).toHaveBeenCalled();
    });
});
