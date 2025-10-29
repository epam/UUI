import * as React from 'react';
import { RangeDatePicker, RangeDatePickerProps } from '../RangeDatePicker';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, screen, within, userEvent, fireEvent, waitFor,
} from '@epam/uui-test-utils';
import dayjs from 'dayjs';
import { supportedDateFormats } from '../helpers';
import { RangeDatePickerValue } from '@epam/uui-core';

type TestProps = Omit<RangeDatePickerProps, 'onValueChange'> & {
    value: RangeDatePickerProps['value'];
};

function parentElemContainsClasses(elem: HTMLElement, classesArr: string[]) {
    // @ts-ignore
    const actualList = [...elem.parentElement.classList];
    return classesArr.every((c: string) => actualList.indexOf(c) !== -1);
}

const getRawTestIdProps = () => {
    return {
        from: { 'data-testid': 'from' },
        to: { 'data-testid': 'to' },
    };
};

async function setupRangeDatePicker(props: TestProps) {
    const { result, mocks } = await setupComponentForTest<RangeDatePickerProps>(
        (context) => ({
            rawProps: getRawTestIdProps(),
            ...props,
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current?.setProperty('value', newValue);
            }),
            // size: '48',
        }),
        (props) => <RangeDatePicker { ...props } />,
    );

    const from = within(screen.getByTestId('from')).getByRole<HTMLInputElement>('textbox');
    const to = within(screen.getByTestId('to')).getByRole<HTMLInputElement>('textbox');

    return {
        result,
        dom: {
            from,
            to,
        },
        mocks: {
            onValueChange: mocks.onValueChange,
            onOpenChange: mocks.onOpenChange,
        },
    };
}

describe('RangeDataPicker', () => {
    it('should be rendered if minimum params and custom format defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <RangeDatePicker
                format="MMM D, YYYY"
                value={ {
                    from: null,
                    to: null,
                } }
                onValueChange={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered if many params defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <RangeDatePicker
                id="date"
                format="MMM D, YYYY"
                value={ {
                    from: null,
                    to: null,
                } }
                onValueChange={ jest.fn }
                renderFooter={ ((value: any) => jest.fn(value)) as any }
                disableClear={ false }
                getPlaceholder={ () => '' }
                isDisabled
                isReadonly
                isInvalid
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should display initial range value correctly', async () => {
        const value = {
            from: '2017-01-22',
            to: '2017-01-28',
        };
        const { dom } = await setupRangeDatePicker({ value });
        expect(dom.from.value).toBe('Jan 22, 2017');
        expect(dom.to.value).toBe('Jan 28, 2017');
    });

    it('should not clear when range is not filled', async () => {
        const value: RangeDatePickerValue = {
            from: null,
            to: null,
        };
        await setupRangeDatePicker({ value });
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should rerender with updated value prop', async () => {
        const value = {
            from: '2017-01-22',
            to: '2017-01-28',
        };
        const { dom, result } = await setupRangeDatePicker({ value });
        expect(dom.from.value).toBe('Jan 22, 2017');
        expect(dom.to.value).toBe('Jan 28, 2017');

        const newValue = {
            from: '2017-01-29',
            to: '2017-01-30',
        };

        result.rerender(<RangeDatePicker
            format="MMM D, YYYY"
            value={ newValue }
            onValueChange={ jest.fn }
            rawProps={ getRawTestIdProps() }
        />);

        const from = within(screen.getByTestId('from')).getByRole<HTMLInputElement>('textbox');
        const to = within(screen.getByTestId('to')).getByRole<HTMLInputElement>('textbox');

        expect(from.value).toBe('Jan 29, 2017');
        expect(to.value).toBe('Jan 30, 2017');
    });

    it('should init with null value correctly', async () => {
        const { dom } = await setupRangeDatePicker({ value: null });
        expect(dom.from.value).toBe('');
        expect(dom.to.value).toBe('');
    });

    it('should open picker on "from" field enter keydown and close on click outside', async () => {
        const { dom, result } = await setupRangeDatePicker({ value: null });
        fireEvent.keyDown(dom.from, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await userEvent.click(result.container);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should open picker on "to" field focus and close on click outside', async () => {
        const { dom, result } = await setupRangeDatePicker({ value: null });
        fireEvent.keyDown(dom.to, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        await userEvent.click(result.container);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should reset invalid "from" value onBlur', async () => {
        const value: RangeDatePickerValue = {
            from: null,
            to: '2019-10-07',
        };
        const {
            dom, result,
        } = await setupRangeDatePicker({ value });

        await userEvent.click(dom.from);
        expect(dom.from).toHaveFocus();
        expect(dom.from.value).toBe('');
        expect(dom.to.value).toBe('Oct 7, 2019');

        await userEvent.type(dom.from, '2019-10-47');
        await userEvent.click(result.container);
        expect(dom.from).not.toHaveFocus();
        expect(dom.from.value).toBe('');
        expect(dom.to.value).toBe('Oct 7, 2019');
    });

    it('should reset invalid "to" value onBlur', async () => {
        const value: RangeDatePickerValue = {
            from: '2019-10-07',
            to: null,
        };
        const {
            dom, result,
        } = await setupRangeDatePicker({ value });

        await userEvent.click(dom.to);
        expect(dom.to).toHaveFocus();
        expect(dom.from.value).toBe('Oct 7, 2019');
        expect(dom.to.value).toBe('');

        await userEvent.type(dom.to, '2019-10-47');
        await userEvent.click(result.container);
        expect(dom.to).not.toHaveFocus();
        expect(dom.from.value).toBe('Oct 7, 2019');
        expect(dom.to.value).toBe('');
    });

    it('should set new value when new value typed in input', async () => {
        const value: RangeDatePickerValue = {
            from: null,
            to: '2019-10-07',
        };
        const {
            dom, result,
        } = await setupRangeDatePicker({ value });

        await userEvent.click(dom.from);
        expect(dom.from).toHaveFocus();
        expect(dom.from.value).toBe('');
        expect(dom.to.value).toBe('Oct 7, 2019');

        await userEvent.type(dom.from, '2019-10-02');
        await userEvent.click(result.container);
        expect(dom.from).not.toHaveFocus();
        expect(dom.from.value).toBe('Oct 2, 2019');
        expect(dom.to.value).toBe('Oct 7, 2019');
    });

    it('should set new value in body when new value typed in "from" input', async () => {
        const value: RangeDatePickerValue = {
            from: '2019-10-10', // this date should be selected to open body in the right month for the test
            to: null,
        };
        const { dom } = await setupRangeDatePicker({ value });

        await userEvent.click(dom.from);

        expect(dom.from).toHaveFocus();
        expect(dom.from.value).toBe('Oct 10, 2019');
        expect(dom.to.value).toBe('');

        await userEvent.clear(dom.from);
        await userEvent.type(dom.from, '2020-10-12');

        expect(dom.from.value).toBe('Oct 12, 2020');

        const selectedDate = await waitFor(() =>
            within(screen.getByAria('multiselectable', 'true'))
                .findByAria('selected', 'true'));
        
        expect(selectedDate.textContent).toContain('12');
    });

    it('should change range on picker body value change', async () => {
        const newValueManualSel = { from: '2019-09-11' };
        const value = {
            from: '2019-09-10',
            to: '2019-09-12',
        };
        const { dom, mocks } = await setupRangeDatePicker({ value });

        await userEvent.click(dom.from);
        const dialog = screen.getByRole('dialog');
        const [sept11] = await within(dialog).findAllByText('11');
        await userEvent.click(sept11);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            from: newValueManualSel.from,
            to: '2019-09-12',
        });
    });

    // TODO: break down to multiple tests
    it('should focus corresponding input on picker value changes starting from start date', async () => {
        const value = {
            from: '2019-09-10',
            to: '2019-09-12',
        };
        const { dom } = await setupRangeDatePicker({ value });

        await userEvent.click(dom.from);
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeTruthy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeFalsy();

        const dialog = screen.getByRole('dialog');

        const [, oct11] = await within(dialog).findAllByText('11');
        await userEvent.click(oct11);
        // on select, focus should be moved to 'to' input
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeFalsy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeTruthy();
        expect(dom.from.value).toBe('Oct 11, 2019');
        expect(dom.to.value).toBe('');

        const [, oct5] = await within(dialog).findAllByText('5');
        await userEvent.click(oct5);
        // since earlier date is selected, focus should be on 'to' elem still
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeFalsy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeTruthy();
        expect(dom.from.value).toBe('Oct 5, 2019');
        expect(dom.to.value).toBe('');

        const [, oct25] = await within(dialog).findAllByText('25');
        await userEvent.click(oct25);
        // should return focus on input after two dates selected
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeTruthy();
        expect(dom.from.value).toBe('Oct 5, 2019');
        expect(dom.to.value).toBe('Oct 25, 2019');
    });

    // TODO: break down to multiple tests
    it('should focus corresponding input on picker values change starting from end date', async () => {
        const value = {
            from: '2019-09-10',
            to: '2019-09-12',
        };
        const { dom, result } = await setupRangeDatePicker({ value });

        await userEvent.clear(dom.from);

        // initial state
        expect(dom.from.value).toBe('');
        expect(dom.to.value).toBe('Sep 12, 2019');

        await userEvent.click(dom.to);
        let dialog = screen.getByRole('dialog');

        /**
         * 'from'
         */
        const [, oct11] = await within(dialog).findAllByText('11');
        await userEvent.click(oct11);
        // should focus 'from' input
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeTruthy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeFalsy();
        // should set 'to' value
        expect(dom.from.value).toBe('');
        expect(dom.to.value).toBe('Oct 11, 2019');

        const [, oct9] = await within(dialog).findAllByText('9');
        await userEvent.click(oct9);
        // should not clear 'to' input, when selecting earlier date in 'from' input
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeFalsy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeTruthy();
        // should set 'from' value, since it earlier then previous 'to' value
        expect(dom.from.value).toBe('Oct 9, 2019');
        expect(dom.to.value).toBe('Oct 11, 2019');

        /**
         * 'to'
         */
        // set focus on 'to'
        await userEvent.click(result.container); // close
        await userEvent.click(dom.to);
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeFalsy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeTruthy();

        dialog = screen.getByRole('dialog');

        const [oct5] = await within(dialog).findAllByText('5');
        await userEvent.click(oct5);
        // should clear 'to' and set new 'from' value if date is selected in 'to' less than 'from'
        // should left focus on 'to' input
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeFalsy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeTruthy();
        expect(dom.from.value).toBe('Oct 5, 2019');
        expect(dom.to.value).toBe('');
    });

    it('should return format', async () => {
        const value = {
            from: '2019-09-10',
            to: '2019-10-10',
        };
        const { dom } = await setupRangeDatePicker({
            value,
            format: 'DD-MM-YYYY',
        });
        expect(dom.from.value).toBe('10-09-2019');
        expect(dom.to.value).toBe('10-10-2019');
    });

    it('should set the same value on from: & to: input', async () => {
        const value = {
            from: '2019-09-10',
            to: '2019-09-10',
        };
        const { dom } = await setupRangeDatePicker({ value });
        expect(dom.from.value).toBe('Sep 10, 2019');
        expect(dom.to.value).toBe('Sep 10, 2019');
    });

    it('should fire onOpenChange event on open state change', async () => {
        const value = {
            from: '2017-01-22',
            to: '2017-01-28',
        };
        const onOpenChange = jest.fn();
        const { result, dom } = await setupRangeDatePicker({
            value,
            onOpenChange,
        });
        await userEvent.click(dom.from);
        expect(onOpenChange).toBeCalledWith(true);
        await userEvent.click(result.container);
        expect(onOpenChange).toBeCalledWith(false);
    });

    it('should support entering from keyboard', async () => {
        const value = {
            from: '2019-09-10',
            to: '2019-09-15',
        };
        const onOpenChange = jest.fn();
        const onBlur = jest.fn();
        const onFocus = jest.fn();
        const { dom, result } = await setupRangeDatePicker({
            value,
            onBlur,
            onFocus,
            onOpenChange,
        });

        await userEvent.clear(dom.from);
        expect(onFocus).toBeCalled();
        expect(dom.from).toHaveFocus();

        await userEvent.type(dom.from, '2019-09-11');

        await userEvent.click(result.container);
        expect(onBlur).toBeCalled();
        expect(dom.from).not.toHaveFocus();
        expect(onOpenChange).toHaveBeenCalledWith(false);

        expect(dom.from.value).toBe('Sep 11, 2019');
        expect(dom.to.value).toBe('Sep 15, 2019');
    });

    it('should support entering from keyboard with custom format', async () => {
        const value = {
            from: '2019-09-10',
            to: '2019-09-15',
        };
        const onOpenChange = jest.fn();
        const onBlur = jest.fn();
        const onFocus = jest.fn();
        const { result, dom } = await setupRangeDatePicker({
            value,
            format: 'DD-MM-YYYY',
            onBlur,
            onFocus,
            onOpenChange,
        });

        await userEvent.clear(dom.from);
        expect(onFocus).toBeCalled();

        await userEvent.type(dom.from, '2019-09-11');
        expect(dom.from).toHaveFocus();

        await userEvent.click(result.container);
        expect(onBlur).toBeCalled();
        expect(dom.from).not.toHaveFocus();
        expect(onOpenChange).toHaveBeenCalledWith(false);

        expect(dom.from.value).toBe('11-09-2019');
        expect(dom.to.value).toBe('15-09-2019');
    });

    it.each(supportedDateFormats())('should support custom format %s', async (currentFormat) => {
        const value = {
            from: '2019-09-10',
            to: '2019-09-15',
        };
        const { dom } = await setupRangeDatePicker({
            value,
            format: currentFormat,
        });
        expect(dom.from.value).toBe(dayjs('2019-09-10').format(currentFormat));
        expect(dom.to.value).toBe(dayjs('2019-09-15').format(currentFormat));
    });

    it('should not select date that does not pass filter callback', async () => {
        const { dom, mocks, result } = await setupRangeDatePicker({
            value: null,
            filter: (date) => dayjs(date).isAfter('2023-01-01'),
        });

        expect(dom.from.value).toEqual('');
        expect(dom.to.value).toEqual('');

        await userEvent.type(dom.from, '2022-12-31');
        await userEvent.click(result.container);

        expect(mocks.onValueChange).not.toHaveBeenCalled();
        expect(dom.from.value).toEqual('');
    });

    it('should prevent picker from being empty when preventEmptyFromDate and preventEmptyToDate when both are true', async () => {
        const value = {
            from: '2019-09-10',
            to: '2019-09-15',
        };

        const { dom, mocks, result } = await setupRangeDatePicker({
            value,
            preventEmptyFromDate: true,
            preventEmptyToDate: true,
        });

        // Clear button should not be present when both preventEmpty props are true
        const clearButton = screen.queryByAria('label', 'Clear selected date range');
        expect(clearButton).not.toBeInTheDocument();

        // Case 1: Clear the 'from' input
        await userEvent.clear(dom.from);
        await userEvent.click(result.container); // emit blur event

        // 'from' value should not change to null
        expect(mocks.onValueChange).not.toHaveBeenCalledWith(expect.objectContaining({ from: null }));
        // Input should revert to the previous valid value
        expect(dom.from.value).toEqual('Sep 10, 2019');

        // Case 2: Clear the 'to' input
        await userEvent.clear(dom.to);
        await userEvent.click(result.container); // emit blur event

        // 'to' value should not change to null
        expect(mocks.onValueChange).not.toHaveBeenCalledWith(expect.objectContaining({ to: null }));
        // Input should revert to the previous valid value
        expect(dom.to.value).toEqual('Sep 15, 2019');

        // Case 3: Type an invalid date in 'from' input
        await userEvent.clear(dom.from);
        await userEvent.type(dom.from, 'invalid-date');
        await userEvent.click(result.container); // emit blur event

        // 'from' value should not change to null
        expect(mocks.onValueChange).not.toHaveBeenCalledWith(expect.objectContaining({ from: null }));
        // Input should revert to the previous valid value
        expect(dom.from.value).toEqual('Sep 10, 2019');
    });

    it('should prevent picker "from" part being empty when preventEmptyFromDate it is true', async () => {
        const value = {
            from: '2019-09-10',
            to: '2019-09-15',
        };

        const { dom, mocks, result } = await setupRangeDatePicker({
            value,
            preventEmptyFromDate: true,
            preventEmptyToDate: false,
        });

        // Clear button should be present when only one preventEmpty prop is true
        const clearButton = screen.queryByAria('label', 'Clear selected date range');
        expect(clearButton).toBeInTheDocument();

        // Case 1: Clear the 'from' input
        await userEvent.clear(dom.from);
        await userEvent.click(result.container); // emit blur event

        // 'from' value should not change to null
        expect(mocks.onValueChange).not.toHaveBeenCalledWith(expect.objectContaining({ from: null }));
        // Input should revert to the previous valid value
        expect(dom.from.value).toEqual('Sep 10, 2019');

        // Case 2: Clear the 'to' input
        await userEvent.clear(dom.to);
        await userEvent.click(result.container); // emit blur event

        // 'to' value should change to null
        expect(mocks.onValueChange).toHaveBeenCalledWith(expect.objectContaining({ to: null }));
        // Input should be empty
        expect(dom.to.value).toEqual('');

        // Case 3: Click the clear button
        await userEvent.click(clearButton!);

        // 'from' value should not change to null, but 'to' should
        expect(mocks.onValueChange).toHaveBeenCalledWith({
            from: '2019-09-10',
            to: null,
        });
    });

    describe('clear icon visibility logic', () => {
        it('should show clear icon when only "from" date is selected and change the status on picker', async () => {
            const value = {
                from: '2019-09-10',
                to: null,
            };
            const { mocks } = await setupRangeDatePicker({ value });
            const clearButton = screen.queryByAria('label', 'Clear selected date range');
            expect(clearButton).toBeInTheDocument();
            await userEvent.click(clearButton);
            expect(mocks.onValueChange).toBeCalledWith({
                from: null,
                to: null,
            });
        });

        it('should show clear icon when only "to" date is selected and change the status on picker', async () => {
            const value = {
                from: null,
                to: '2019-09-15',
            };
            const { mocks } = await setupRangeDatePicker({ value });
            const clearButton = screen.queryByAria('label', 'Clear selected date range');
            expect(clearButton).toBeInTheDocument();
            await userEvent.click(clearButton);
            expect(mocks.onValueChange).toBeCalledWith({
                from: null,
                to: null,
            });
        });

        it('should show clear icon when both dates are selected and change the status on picker', async () => {
            const value = {
                from: '2019-09-10',
                to: '2019-09-15',
            };
            const { mocks } = await setupRangeDatePicker({ value });
            const clearButton = screen.queryByAria('label', 'Clear selected date range');
            expect(clearButton).toBeInTheDocument();
            await userEvent.click(clearButton);
            expect(mocks.onValueChange).toBeCalledWith({
                from: null,
                to: null,
            });
        });

        it('should not show clear icon when no dates are selected', async () => {
            const value = {
                from: null,
                to: null,
            };
            await setupRangeDatePicker({ value });
            const clearButton = screen.queryByAria('label', 'Clear selected date range');
            expect(clearButton).not.toBeInTheDocument();
        });

        it('should not show clear icon when disableClear is true', async () => {
            const value = {
                from: '2019-09-10',
                to: '2019-09-15',
            };
            await setupRangeDatePicker({
                value,
                disableClear: true,
            });
            const clearButton = screen.queryByAria('label', 'Clear selected date range');
            expect(clearButton).not.toBeInTheDocument();
        });

        it('should not show clear icon when both preventEmptyFromDate and preventEmptyToDate are true', async () => {
            const value = {
                from: '2019-09-10',
                to: '2019-09-15',
            };
            await setupRangeDatePicker({ 
                value,
                preventEmptyFromDate: true,
                preventEmptyToDate: true,
            });
            const clearButton = screen.queryByAria('label', 'Clear selected date range');
            expect(clearButton).not.toBeInTheDocument();
        });

        it('should show clear icon when only one preventEmpty prop is true and change the status on picker', async () => {
            const value = {
                from: '2019-09-10',
                to: '2019-09-15',
            };

            const { mocks } = await setupRangeDatePicker({
                value,
                preventEmptyFromDate: true,
                preventEmptyToDate: false,
            });
            const clearButton = screen.queryByAria('label', 'Clear selected date range');
            expect(clearButton).toBeInTheDocument();
            await userEvent.click(clearButton);
            expect(mocks.onValueChange).toBeCalledWith({
                from: '2019-09-10',
                to: null,
            });
        });

        it('should not show clear icon when only one preventEmpty prop is true and only that value presented', async () => {
            const value = {
                from: null,
                to: '2019-09-15',
            };

            await setupRangeDatePicker({
                value,
                preventEmptyFromDate: false,
                preventEmptyToDate: true,
            });
            const clearButton = screen.queryByAria('label', 'Clear selected date range');
            expect(clearButton).not.toBeInTheDocument();
        });
    });
});
