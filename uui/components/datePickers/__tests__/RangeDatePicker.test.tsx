import * as React from 'react';
import { RangeDatePicker, RangeDatePickerProps } from '../RangeDatePicker';
import { renderSnapshotWithContextAsync, setupComponentForTest, fireEvent, screen, within } from '@epam/test-utils';

jest.mock('react-popper', () => {
    const PopperJS = jest.requireActual('react-popper');
    const Popper = function ({ children }: any) {
        return children({
            ref: jest.fn,
            placement: 'bottom-start',
            style: {
                position: 'fixed',
                top: 0,
                right: 'auto',
                bottom: 'auto',
                left: 0,
            },
            update: jest.fn(),
            isReferenceHidden: false,
            arrowProps: {
                ref: jest.fn,
            },
        });
    };
    return {
        ...PopperJS,
        Popper,
    };
});

async function setupRangeDatePicker(params: { value: { from: string, to: string } | null, format?: string }) {
    const { value, format } = params;

    const { result, mocks } = await setupComponentForTest<RangeDatePickerProps>(
        (context) => ({
            rawProps: { from: { 'data-testid': 'from' }, to: { 'data-testid': 'to' } },
            value,
            format,
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
        }),
        props => <RangeDatePicker { ...props } />,
    );

    const from = within(result.getByTestId('from')).getByRole('textbox') as HTMLInputElement;
    const to = within(result.getByTestId('to')).getByRole('textbox') as HTMLInputElement;
    const clear = result.container.querySelector('.uui-icon-cancel');

    return {
        result,
        dom: { from, to, clear },
        mocks: { onValueChange: mocks.onValueChange },
    };
}

describe('RangeDataPicker', () => {
    it('should be rendered if minimum params and custom format defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <RangeDatePicker
                format="MMM D, YYYY"
                value={ null }
                onValueChange={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered if many params defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <RangeDatePicker
                format="MMM D, YYYY"
                value={ null }
                onValueChange={ jest.fn }
                renderFooter={ ((value: any) => jest.fn(value)) as any }
                disableClear={ false }
                getPlaceholder={ (type) => '' }
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
        const { result } = await setupRangeDatePicker({ value: null });
        expect(result.container).not.toBeFalsy();
    });

    it('should change state on picker clear', async () => {
        const value = { from: '2017-01-22', to: '2017-01-28' };
        const { dom, mocks } = await setupRangeDatePicker({ value });
        fireEvent.click(dom.clear);
        expect(mocks.onValueChange).toBeCalledWith({ from: null, to: null });
    });

    it(`should open picker on 'from' field focus and close it on blur`, async () => {
        const { dom } = await setupRangeDatePicker({ value: null });
        fireEvent.focus(dom.from);
        expect(await screen.queryByRole('dialog')).toBeTruthy();
        fireEvent.blur(dom.from);
        expect(await screen.queryByRole('dialog')).toBeFalsy();
    });

    it(`should open picker on "To" field focus and close it on blur`, async () => {
        const { dom } = await setupRangeDatePicker({ value: null });
        fireEvent.focus(dom.to);
        expect(await screen.queryByRole('dialog')).toBeTruthy();
        fireEvent.blur(dom.to);
        expect(await screen.queryByRole('dialog')).toBeFalsy();
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
        const dialog = await screen.queryByRole('dialog');
        const [sept11, oct11] = await within(dialog).findAllByText('11');
        fireEvent.click(sept11);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            from: newValueManualSel.from,
            to: '2019-09-12',
        });
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
});
