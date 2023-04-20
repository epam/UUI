import * as React from 'react';
import dayjs from 'dayjs';
import { fireEvent, setupComponentForTest, screen } from '@epam/test-utils';
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
        (props) => <DatePickerHeader { ...props } />,
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
        const { dom } = await setupDatePickerHeader({ initialDate: '2017-01-22' });

        expect(screen.getByText('January 2017')).toBeInTheDocument();

        fireEvent.click(dom.left);
        expect(screen.getByText('December 2016')).toBeInTheDocument();

        fireEvent.click(dom.right);
        expect(screen.getByText('January 2017')).toBeInTheDocument();

        fireEvent.click(dom.right);
        expect(screen.getByText('February 2017')).toBeInTheDocument();
    });

    it('should change view on header caption click', async () => {
        const { dom } = await setupDatePickerHeader({ initialDate: '2017-01-22' });
        expect(screen.getByText('January 2017')).toBeInTheDocument();

        fireEvent.click(dom.title);
        expect(screen.getByText('2017')).toBeInTheDocument();

        fireEvent.click(dom.title);
        expect(screen.getByText('January 2017')).toBeInTheDocument();
    });
});
