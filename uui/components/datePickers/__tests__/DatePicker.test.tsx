import * as React from 'react';
import { renderSnapshotWithContextAsync, fireEvent, setupComponentForTest, screen, userEvent } from '@epam/uui-test-utils';
import { DatePicker, DatePickerProps } from '../DatePicker';
import dayjs from 'dayjs';
import { supportedDateFormats } from '@epam/uui-components';

type TestParams = Pick<DatePickerProps, 'value' | 'format' | 'isHoliday'>;

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
                format={ DATE_FORMAT_DEFAULT } value={ null }
                onValueChange={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DatePicker
                format={ DATE_FORMAT_DEFAULT }
                value={ null }
                onValueChange={ jest.fn }
                placeholder="Test"
                disableClear={ false }
                renderFooter={ () => <div>Test footer</div> }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should open picker on field focus', async () => {
        const { dom } = await setupDatePicker({
            value: null,
            format: DATE_FORMAT_DEFAULT,
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        fireEvent.focus(dom.input);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close picker on field blur', async () => {
        const { dom } = await setupDatePicker({
            value: null,
            format: DATE_FORMAT_DEFAULT,
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        fireEvent.focus(dom.input);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.blur(dom.input);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should change input value after change props', async () => {
        const {
            dom, mocks, setProps,
        } = await setupDatePicker({
            value: null,
            format: DATE_FORMAT_DEFAULT,
        });
        expect(dom.input.value).toEqual('');
        setProps({ value: '2017-01-22' });
        expect(dom.input.value).toEqual('Jan 22, 2017');
        expect(mocks.onValueChange).not.toHaveBeenCalled();
    });

    it('should clear input when clear button is clicked', async () => {
        const { dom, mocks } = await setupDatePicker({
            value: '2017-01-22',
            format: DATE_FORMAT_DEFAULT,
        });
        const clear = screen.getByRole<HTMLButtonElement>('button');
        expect(dom.input.value).toEqual('Jan 22, 2017');
        fireEvent.click(clear);
        expect(dom.input.value).toEqual('');
        expect(mocks.onValueChange).toHaveBeenCalledWith(null);
    });

    it('should reset invalid value onBlur', async () => {
        const { dom, mocks } = await setupDatePicker({
            value: null,
            format: DATE_FORMAT_DEFAULT,
        });
        expect(dom.input.value).toEqual('');
        fireEvent.change(dom.input, { target: { value: '2019-10-47' } });
        expect(dom.input.value).toEqual('2019-10-47');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('');
        expect(mocks.onValueChange).toHaveBeenCalledWith(null);
    });

    it('should set new value with custom format', async () => {
        const { dom, mocks } = await setupDatePicker({
            value: null,
            format: DATE_FORMAT_CUSTOM,
        });
        expect(dom.input.value).toEqual('');
        fireEvent.change(dom.input, { target: { value: '31-01-2017' } });
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

        fireEvent.focus(dom.input);

        const holidayDay = screen.getByText('20');
        const regularDay = screen.getByText('21');

        expect(parentElemContainsClasses(holidayDay, ['uui-calendar-day-holiday'])).toBeTruthy();
        expect(parentElemContainsClasses(regularDay, ['uui-calendar-day-holiday'])).toBeFalsy();
    });
});
