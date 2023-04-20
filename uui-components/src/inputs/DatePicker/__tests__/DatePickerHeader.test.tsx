import * as React from 'react';
import dayjs from 'dayjs';
import { fireEvent, setupComponentForTest } from '@epam/test-utils';
import { DatePickerHeader, DatePickerHeaderProps } from '../DatePickerHeader';

async function setupDatePickerHeader(params: { initialDate: string }) {
    const value = {
        view: 'DAY_SELECTION' as any,
        selectedDate: '',
        displayedDate: dayjs(params.initialDate).startOf('day'),
    };

    const { result } = await setupComponentForTest<DatePickerHeaderProps>(
        (context) => ({
            value,
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
        }),
        (props) => <DatePickerHeader {...props} />
    );

    const left = result.container.querySelector('.uui-datepickerheader-nav-icon-left');
    const right = result.container.querySelector('.uui-datepickerheader-nav-icon-right');
    const title = result.container.querySelector('.uui-datepickerheader-nav-title');

    return {
        result,
        dom: { left, right, title },
    };
}

describe('DatePickerHeader', () => {
    it('should change date on arrow click', async () => {
        const { result, dom } = await setupDatePickerHeader({ initialDate: '2017-01-22' });

        expect(result.queryByText('January 2017')).toBeTruthy();

        fireEvent.click(dom.left);
        expect(result.queryByText('December 2016')).toBeTruthy();

        fireEvent.click(dom.right);
        expect(result.queryByText('January 2017')).toBeTruthy();

        fireEvent.click(dom.right);
        expect(result.queryByText('February 2017')).toBeTruthy();
    });

    it('should change view on header caption click', async () => {
        const { result, dom } = await setupDatePickerHeader({ initialDate: '2017-01-22' });
        expect(result.queryByText('January 2017')).toBeTruthy();

        fireEvent.click(dom.title);
        expect(result.queryByText('2017')).toBeTruthy();

        fireEvent.click(dom.title);
        expect(result.queryByText('January 2017')).toBeTruthy();
    });
});
