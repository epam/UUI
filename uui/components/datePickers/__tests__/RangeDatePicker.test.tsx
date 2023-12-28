import * as React from 'react';
import { RangeDatePicker, RangeDatePickerProps } from '../RangeDatePicker';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, fireEvent, screen, within, userEvent,
} from '@epam/uui-test-utils';

interface TestProps {
    value?: RangeDatePickerProps['value'];
    format?: RangeDatePickerProps['format'];
    onBlur?: RangeDatePickerProps['onBlur'];
    onFocus?: RangeDatePickerProps['onFocus'];
    isHoliday?: RangeDatePickerProps['isHoliday'];
    onOpenChange?: RangeDatePickerProps['onOpenChange'];
}

function parentElemContainsClasses(elem: HTMLElement, classesArr: string[]) {
    // @ts-ignore
    const actualList = [...elem.parentElement.classList];
    return classesArr.every((c: string) => actualList.indexOf(c) !== -1);
}

async function setupRangeDatePicker(props: TestProps) {
    const { result, mocks } = await setupComponentForTest<RangeDatePickerProps>(
        (context) => ({
            rawProps: { from: { 'data-testid': 'from' }, to: { 'data-testid': 'to' } },
            ...props,
            value: props.value || { from: null, to: null },
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current?.setProperty('value', newValue);
            }),
            size: '48',
        }),
        (props) => <RangeDatePicker { ...props } />,
    );

    const from = within(screen.getByTestId('from')).getByRole<HTMLInputElement>('textbox');
    const to = within(screen.getByTestId('to')).getByRole<HTMLInputElement>('textbox');

    return {
        result,
        dom: { from, to },
        mocks: { onValueChange: mocks.onValueChange, onOpenChange: mocks.onOpenChange },
    };
}

describe('RangeDataPicker', () => {
    it('should be rendered if minimum params and custom format defined', async () => {
        const tree = await renderSnapshotWithContextAsync(<RangeDatePicker format="MMM D, YYYY" value={ { from: null, to: null } } onValueChange={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered if many params defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <RangeDatePicker
                format="MMM D, YYYY"
                value={ { from: null, to: null } }
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

    it('should change input value after change props', async () => {
        const value = { from: '2017-01-22', to: '2017-01-28' };
        const { dom } = await setupRangeDatePicker({ value });
        expect(dom.from.value).toBe('Jan 22, 2017');
        expect(dom.to.value).toBe('Jan 28, 2017');
    });

    it('should render with default props', async () => {
        const { result } = await setupRangeDatePicker({ value: undefined });
        expect(result.container).not.toBeFalsy();
    });

    it('should change state on picker clear', async () => {
        const value = { from: '2017-01-22', to: '2017-01-28' };
        const { mocks } = await setupRangeDatePicker({ value });
        const clear = screen.getByRole('button');
        fireEvent.click(clear);
        expect(mocks.onValueChange).toBeCalledWith({ from: null, to: null });
    });

    it("should open picker on 'from' field focus and close it on blur", async () => {
        const { dom } = await setupRangeDatePicker({ value: undefined });
        fireEvent.focus(dom.from);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.blur(dom.from);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should open picker on "To" field focus and close it on blur', async () => {
        const { dom } = await setupRangeDatePicker({ value: undefined });
        fireEvent.focus(dom.to);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.blur(dom.to);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should reset invalid "From" value onBlur', async () => {
        const value = { from: '2019-10-47', to: '2019-10-07' };
        const { dom, mocks } = await setupRangeDatePicker({ value });
        fireEvent.blur(dom.from);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            from: null,
            to: value.to,
        });
    });

    it('should set new value when new value typed in input', async () => {
        const newValueManualTyping = { from: 'Sep 11, 2019', to: 'Sep 20, 2019' };
        const value = { from: '2019-09-14', to: '2019-09-15' };
        const { dom, mocks } = await setupRangeDatePicker({ value });

        fireEvent.change(dom.from, { target: { value: newValueManualTyping.from } });
        fireEvent.blur(dom.from);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            from: '2019-09-11',
            to: '2019-09-15',
        });
    });

    it('should change range on picker body value change', async () => {
        const newValueManualSel = { from: '2019-09-11' };
        const value = { from: '2019-09-10', to: '2019-09-12' };
        const { dom, mocks } = await setupRangeDatePicker({ value });

        fireEvent.focus(dom.from);
        const dialog = screen.getByRole('dialog');
        const [sept11] = await within(dialog).findAllByText('11');
        fireEvent.click(sept11);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            from: newValueManualSel.from,
            to: '2019-09-12',
        });
    });

    it('should focus corresponding input on picker values change', async () => {
        const value = { from: '2019-09-10', to: '2019-09-12' };
        const { dom } = await setupRangeDatePicker({ value });

        await userEvent.click(dom.from);
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeTruthy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeFalsy();

        const dialog = screen.getByRole('dialog');
        const [, oct11] = await within(dialog).findAllByText('11');

        expect(dom.from.value).toBe('Sep 10, 2019');
        expect(dom.to.value).toBe('Sep 12, 2019');

        // on select, focus should be moved to 'to' input
        await userEvent.click(oct11);
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeFalsy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeTruthy();
        expect(dom.from.value).toBe('Oct 11, 2019');
        expect(dom.to.value).toBe('');

        const [, oct5] = await within(dialog).findAllByText('5');

        // since earlier date is selected, focus should be on 'to' elem still
        await userEvent.click(oct5);
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeFalsy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeTruthy();
        expect(dom.from.value).toBe('Oct 5, 2019');
        expect(dom.to.value).toBe('');

        const [, oct25] = await within(dialog).findAllByText('25');

        // should cancel focus when two dates selected
        await userEvent.click(oct25);
        expect(parentElemContainsClasses(dom.from, ['uui-focus'])).toBeFalsy();
        expect(parentElemContainsClasses(dom.to, ['uui-focus'])).toBeFalsy();
        expect(dom.from.value).toBe('Oct 5, 2019');
        expect(dom.to.value).toBe('Oct 25, 2019');
    });

    it('should format value onBlur', async () => {
        const value = { from: '2019-09-10', to: '2019-10-10' };
        const newValueInIsoFormat = { from: '2019-09-11', to: '2019-10-11' };

        const { dom } = await setupRangeDatePicker({ value });
        expect(dom.from.value).toBe('Sep 10, 2019');
        fireEvent.change(dom.from, { target: { value: newValueInIsoFormat.from } });
        fireEvent.blur(dom.from);
        expect(dom.from.value).toBe('Sep 11, 2019');

        fireEvent.change(dom.to, { target: { value: newValueInIsoFormat.to } });
        fireEvent.blur(dom.to);
        expect(dom.to.value).toBe('Oct 11, 2019');
    });

    it('should return format', async () => {
        const value = { from: '2019-09-10', to: '2019-10-10' };
        const { dom } = await setupRangeDatePicker({ value, format: 'DD-MM-YYYY' });
        expect(dom.from.value).toBe('10-09-2019');
        expect(dom.to.value).toBe('10-10-2019');
    });

    it('should set the same value on from: & to: input', async () => {
        const value = { from: '2019-09-10', to: '2019-09-10' };
        const { dom } = await setupRangeDatePicker({ value });
        expect(dom.from.value).toBe('Sep 10, 2019');
        expect(dom.to.value).toBe('Sep 10, 2019');
    });

    it('should fire onOpenChange event on open state change', async () => {
        const value = { from: '2017-01-22', to: '2017-01-28' };
        const onOpenChange = jest.fn();
        const { dom } = await setupRangeDatePicker({ value, onOpenChange });
        fireEvent.focus(dom.from);
        expect(onOpenChange).toBeCalledWith(true);
        fireEvent.blur(dom.from);
        expect(onOpenChange).toBeCalledWith(false);
    });

    it('should support entering from keyboard', async () => {
        const value = { from: '2019-09-10', to: '2019-09-15' };
        const onOpenChange = jest.fn();
        const onBlur = jest.fn();
        const onFocus = jest.fn();
        const { dom, result } = await setupRangeDatePicker({ value, onBlur, onFocus, onOpenChange });

        await userEvent.clear(dom.from);
        expect(onFocus).toBeCalled();
        expect(dom.from).toHaveFocus();
        expect(onOpenChange).toHaveBeenCalledWith(true);

        await userEvent.type(dom.from, '2019-09-11');

        await userEvent.click(result.container);
        expect(onBlur).toBeCalled();
        expect(dom.from).not.toHaveFocus();
        expect(onOpenChange).toHaveBeenCalledWith(false);

        expect(dom.from.value).toBe('Sep 11, 2019');
        expect(dom.to.value).toBe('Sep 15, 2019');
    });

    it('should support entering from keyboard with custom format', async () => {
        const value = { from: '2019-09-10', to: '2019-09-15' };
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
        expect(onOpenChange).toHaveBeenCalledWith(true);

        await userEvent.type(dom.from, '2019-09-11');
        expect(dom.from).toHaveFocus();

        await userEvent.click(result.container);
        expect(onBlur).toBeCalled();
        expect(dom.from).not.toHaveFocus();
        expect(onOpenChange).toHaveBeenCalledWith(false);

        expect(dom.from.value).toBe('11-09-2019');
        expect(dom.to.value).toBe('15-09-2019');
    });
});
