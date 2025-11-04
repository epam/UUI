import * as React from 'react';
import {
    renderSnapshotWithContextAsync, fireEvent, setupComponentForTest, screen, userEvent, within,
} from '@epam/uui-test-utils';
import { DatePicker, DatePickerProps } from '../DatePicker';
import dayjs from 'dayjs';
import { supportedDateFormats } from '../helpers';

type TestParams = Omit<DatePickerProps, 'onValueChange'>;

function parentElemContainsClasses(elem: HTMLElement, classesArr: string[]) {
    // @ts-ignore
    const actualList = [...elem.parentElement.classList];
    return classesArr.every((c: string) => actualList.indexOf(c) !== -1);
}

async function setupDatePicker(params: TestParams) {
    const {
        result, mocks, setProps,
    } = await setupComponentForTest<DatePickerProps>(
        (context) => ({
            ...params,
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current?.setProperty('value', newValue);
            }),
            size: '42',
            rawProps: {
                body: {
                    'data-testid': 'datePickerBody',
                },
            },
        }),
        (props) => <DatePicker { ...props } />,
    );

    const input = screen.getByRole<HTMLInputElement>('textbox');
    const dom = { input };

    return {
        result,
        setProps,
        mocks,
        dom,
    };
}

const DATE_FORMAT_DEFAULT = 'MMM D, YYYY';
const DATE_FORMAT_CUSTOM = 'DD-MM-YYYY';

describe('DatePicker', () => {
    it('should render with minimum props defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DatePicker
                value={ null }
                onValueChange={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DatePicker
                value={ null }
                onValueChange={ jest.fn }
                placeholder="Test"
                disableClear={ false }
                renderFooter={ () => <div>Test footer</div> }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should update input value on props update', async () => {
        const { setProps } = await setupDatePicker({
            value: null,
        });

        const input = screen.getByRole<HTMLInputElement>('textbox');
        expect(input.value).toEqual('');
        setProps({ value: '2017-01-22' });
        expect(input.value).toEqual('Jan 22, 2017');
    });

    it('should update month of date picker body on props update', async () => {
        const { setProps } = await setupDatePicker({
            value: '2017-01-22',
        });

        await userEvent.click(screen.getByRole('textbox'));
        expect(screen.getByText('January 2017')).toBeInTheDocument();
        setProps({ value: '2017-02-22' });
        expect(screen.getByText('February 2017')).toBeInTheDocument();
    });

    it('should send value change in valid format', async () => {
        const {
            dom, mocks, result,
        } = await setupDatePicker({
            value: null,
            format: DATE_FORMAT_DEFAULT,
        });

        await userEvent.type(dom.input, 'Jan 1, 2020');
        await userEvent.click(result.container); // emit blur event
        expect(mocks.onValueChange).toHaveBeenCalledWith('2020-01-01');
    });

    it('should reopen with selected month when previously selected another one', async () => {
        const { result } = await setupDatePicker({
            value: '2017-01-22',
        });

        await userEvent.click(screen.getByRole('textbox')); // open picker
        expect(screen.getByText('January 2017')).toBeInTheDocument();

        await userEvent.click(screen.getByText('22')); // select date

        await userEvent.click(screen.getByRole('textbox')); // open picker

        const datePickerBody = screen.getByTestId('datePickerBody');
        const [,,nexMonthButton] = within(datePickerBody).queryAllByRole('button');

        await userEvent.click(nexMonthButton); // go to next month
        expect(screen.getByText('February 2017')).toBeInTheDocument();
        await userEvent.click(nexMonthButton); // go to next month
        expect(screen.getByText('March 2017')).toBeInTheDocument();

        await userEvent.click(result.container); // emit blur event
        expect(screen.queryByText('March 2017')).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('textbox')); // open picker
        // should open month with selected date
        expect(screen.getByText('January 2017')).toBeInTheDocument();
    });

    it('should change month and year correctly', async () => {
        await setupDatePicker({
            value: '2017-01-22',
        });

        await userEvent.click(screen.getByRole('textbox')); // open picker
        expect(screen.getByText('January 2017')).toBeInTheDocument();

        const datePickerBody = screen.getByTestId('datePickerBody');
        const [, titleButton, nextMonthButton] = within(datePickerBody).queryAllByRole('button');

        await userEvent.click(nextMonthButton); // go to next month
        expect(screen.getByText('February 2017')).toBeInTheDocument();

        await userEvent.click(titleButton);
        const [, yearButton] = within(datePickerBody).queryAllByRole('button');

        await userEvent.click(yearButton);
        await userEvent.click(screen.getByText('2024')); // go to 2024
        await userEvent.click(screen.getByText('Mar'));

        expect(screen.getByText('March 2024')).toBeInTheDocument();
    });

    it('should open picker on enter press on input', async () => {
        const { dom } = await setupDatePicker({
            value: null,
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        fireEvent.keyDown(dom.input, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should change input value after change props', async () => {
        const {
            dom, mocks, setProps,
        } = await setupDatePicker({
            value: null,
        });
        expect(dom.input.value).toEqual('');
        setProps({ value: '2017-01-22' });
        expect(dom.input.value).toEqual('Jan 22, 2017');
        expect(mocks.onValueChange).not.toHaveBeenCalled();
    });

    it('should clear input when clear button is clicked', async () => {
        const { dom, mocks } = await setupDatePicker({
            value: '2017-01-22',
        });
        const clear = screen.getByRole<HTMLButtonElement>('button');
        expect(dom.input.value).toEqual('Jan 22, 2017');
        fireEvent.click(clear);
        expect(dom.input.value).toEqual('');
        expect(mocks.onValueChange).toHaveBeenCalledWith(null);
    });

    it('should close picker on field blur', async () => {
        const { dom, result } = await setupDatePicker({
            value: null,
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await userEvent.click(dom.input);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await userEvent.click(result.container);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should not select date that does not pass filter callback', async () => {
        const { dom, mocks } = await setupDatePicker({
            value: null,
            filter: (date) => dayjs(date).isAfter('2023-01-01'),
        });

        expect(dom.input.value).toEqual('');
        await userEvent.type(dom.input, '2022-12-31');
        fireEvent.blur(dom.input);

        expect(mocks.onValueChange).not.toHaveBeenCalled();
        expect(dom.input.value).toEqual('');
    });

    it('should set new value with custom format', async () => {
        const {
            dom, mocks, result,
        } = await setupDatePicker({
            value: null,
            format: DATE_FORMAT_CUSTOM,
        });

        expect(dom.input.value).toEqual('');
        await userEvent.type(dom.input, '31-01-2017');
        await userEvent.click(result.container);

        expect(mocks.onValueChange).toHaveBeenCalledWith('2017-01-31');
        expect(dom.input.value).toEqual('31-01-2017');
    });

    // 'MM/DD/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY', 'YYYY/MM/DD', 'YYYY-MM-DD', 'YYYY.MM.DD', 'MMM D, YYYY', 'D/M/YYYY', 'YYYY/M/D',

    it('should support entering date from keyboard in default format', async () => {
        const { dom, mocks } = await setupDatePicker({ value: null });
        expect(dom.input.value).toEqual('');
        fireEvent.change(dom.input, { target: { value: '2017-01-22' } });
        fireEvent.blur(dom.input);
        expect(mocks.onValueChange).toHaveBeenCalledWith('2017-01-22');
        expect(dom.input.value).toEqual('Jan 22, 2017');
    });

    it.each(supportedDateFormats())('should support entering date from keyboard in custom format %s', async (currentFormat) => {
        const one = await setupDatePicker({
            value: null,
            format: currentFormat,
        });
        expect(one.dom.input.value).toEqual('');
        await userEvent.type(one.dom.input, '2017-01-22');
        await userEvent.click(one.result.container); // emit blur event

        expect(one.mocks.onValueChange).toHaveBeenCalledWith('2017-01-22');
        expect(one.dom.input.value).toBe(dayjs('2017-01-22').format(currentFormat));
    });

    it('should render with isHoliday prop', async () => {
        const { dom } = await setupDatePicker({
            value: '2019-10-12',
            format: DATE_FORMAT_DEFAULT,
            isHoliday: (day) => {
                return day?.valueOf() === dayjs('2019-10-20').valueOf();
            },
        });

        fireEvent.click(dom.input);

        const holidayDay = screen.getByText('20');
        const regularDay = screen.getByText('21');

        expect(parentElemContainsClasses(holidayDay, ['uui-calendar-day-holiday'])).toBeTruthy();
        expect(parentElemContainsClasses(regularDay, ['uui-calendar-day-holiday'])).toBeFalsy();
    });

    it('should not fire onValueChange when value is the same on blur', async () => {
        const {
            dom: { input }, mocks, result,
        } = await setupDatePicker({
            value: '2017-01-22',
        });

        await userEvent.click(input); // open picker
        await userEvent.click(screen.getByText('25')); // select date
        await userEvent.click(result.container); // emit blur event (close)

        await userEvent.click(input); // open picker
        await userEvent.click(result.container); // emit blur event (close)

        await userEvent.click(input); // open picker
        await userEvent.click(result.container); // emit blur event (close)

        expect(mocks.onValueChange).toHaveBeenCalledTimes(1);
    });

    it('should not fire onValueChange when value is null and the same on blur', async () => {
        const {
            dom, mocks, result,
        } = await setupDatePicker({
            value: null,
        });
        expect(dom.input.value).toEqual('');

        await userEvent.type(dom.input, '2019-10-47');
        expect(dom.input.value).toEqual('2019-10-47');

        await userEvent.click(result.container);
        expect(dom.input.value).toEqual('');
        expect(mocks.onValueChange).not.toHaveBeenCalledWith(null);
    });

    it('should fire onValuChange event clearing input manually', async () => {
        const {
            dom: { input }, mocks, result,
        } = await setupDatePicker({
            value: '2017-01-22',
        });

        await userEvent.clear(input);
        await userEvent.click(result.container); // emit blur event (close)
        expect(mocks.onValueChange).toHaveBeenCalledWith(null);
    });

    it('should respect preventEmpty prop by maintaining the last valid value', async () => {
        const {
            dom, mocks, result,
        } = await setupDatePicker({
            value: '2017-01-22',
            preventEmpty: true,
        });

        // Clear button should not be present when preventEmpty is true
        const clearButton = screen.queryByAria('label', 'Clear input');
        expect(clearButton).not.toBeInTheDocument();

        // Case 1: Type an invalid date
        await userEvent.clear(dom.input);
        await userEvent.type(dom.input, 'invalid-date');
        await userEvent.click(result.container); // emit blur event

        // Value should not change to null
        expect(mocks.onValueChange).not.toHaveBeenCalledWith(null);
        // Input should revert to the previous valid value
        expect(dom.input.value).toEqual('Jan 22, 2017');

        // Case 2: Clear the input without typing anything
        await userEvent.clear(dom.input);
        await userEvent.click(result.container); // emit blur event

        // Value should not change to null
        expect(mocks.onValueChange).not.toHaveBeenCalledWith(null);
        // Input should revert to the previous valid value
        expect(dom.input.value).toEqual('Jan 22, 2017');
    });

    describe('initialViewDate', () => {
        it('should display initialViewDate month when value is null', async () => {
            const { dom } = await setupDatePicker({
                value: null,
                initialViewDate: '2025-06-15',
            });

            await userEvent.click(dom.input);
            expect(screen.getByText('June 2025')).toBeInTheDocument();
        });

        it('should display value month when both value and initialViewDate are provided', async () => {
            const { dom } = await setupDatePicker({
                value: '2017-01-22',
                initialViewDate: '2025-06-15',
            });

            await userEvent.click(dom.input);
            expect(screen.getByText('January 2017')).toBeInTheDocument();
            expect(screen.queryByText('June 2025')).not.toBeInTheDocument();
        });

        it('should update displayed month when initialViewDate changes and value is null', async () => {
            const { dom, setProps, result } = await setupDatePicker({
                value: null,
                initialViewDate: '2025-06-15',
            });

            await userEvent.click(dom.input);
            expect(screen.getByText('June 2025')).toBeInTheDocument();

            await userEvent.click(result.container);
            setProps({ initialViewDate: '2024-03-10' });
            await userEvent.click(dom.input);
            expect(screen.getByText('March 2024')).toBeInTheDocument();
        });

        it('should use current month when initialViewDate is not provided and value is null', async () => {
            const { dom } = await setupDatePicker({
                value: null,
            });

            await userEvent.click(dom.input);
            const currentMonth = dayjs().format('MMMM YYYY');
            expect(screen.getByText(currentMonth)).toBeInTheDocument();
        });
    });
});
