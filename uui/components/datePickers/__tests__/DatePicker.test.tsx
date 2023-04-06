import * as React from 'react';
import { renderSnapshotWithContextAsync, fireEvent, setupComponentForTest } from '@epam/test-utils';
import { DatePicker, DatePickerProps } from '../DatePicker';

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
async function setupDatePicker(params: { value: string | null, format: string }) {
    const { format, value } = params;

    const { result, mocks, setProps } = await setupComponentForTest<DatePickerProps>(
        (context) => ({
            value,
            format,
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
        }),
        (props) => <DatePicker { ...props } />,
    );

    const input = result.queryByRole('textbox') as HTMLInputElement;
    const clear = result.container.querySelector('.uui-icon-cancel');

    return {
        result,
        setProps,
        mocks: { onValueChange: mocks.onValueChange },
        dom: { input, clear },
    };
}

const DATE_FORMAT_DEFAULT = 'MMM D, YYYY';
const DATE_FORMAT_CUSTOM = 'DD-MM-YYYY';

describe('DatePicker', () => {
    it('should render with minimum props defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DatePicker format={ DATE_FORMAT_DEFAULT } value={ null } onValueChange={ jest.fn } />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props defined', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DatePicker
                format={ DATE_FORMAT_DEFAULT }
                value={ null }
                onValueChange={ jest.fn }
                placeholder='Test'
                disableClear={ false }
                renderFooter={ () => <div>Test footer</div>  }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it(`should open picker on field focus`, async () => {
        const { result, dom } = await setupDatePicker({ value: null, format: DATE_FORMAT_DEFAULT });
        expect(result.queryByRole('dialog')).toBeFalsy();
        fireEvent.focus(dom.input);
        expect(result.queryByRole('dialog')).toBeTruthy();
    });

    it(`should close picker on field blur`, async () => {
        const { result, dom } = await setupDatePicker({ value: null, format: DATE_FORMAT_DEFAULT });
        expect(result.queryByRole('dialog')).toBeFalsy();
        fireEvent.focus(dom.input);
        expect(result.queryByRole('dialog')).toBeTruthy();
        fireEvent.blur(dom.input);
        expect(result.queryByRole('dialog')).toBeFalsy();
    });

    it('should change input value after change props', async () => {
        const { result, dom, mocks, setProps } = await setupDatePicker({ value: null, format: DATE_FORMAT_DEFAULT });
        expect(dom.input.value).toEqual('');
        setProps({ value: '2017-01-22' });
        expect(dom.input.value).toEqual('Jan 22, 2017');
        expect(mocks.onValueChange).not.toHaveBeenCalled();
    });

    it('should clear input when clear button is clicked', async () => {
        const { result, dom, mocks } = await setupDatePicker({ value: '2017-01-22', format: DATE_FORMAT_DEFAULT });
        expect(dom.input.value).toEqual('Jan 22, 2017');
        fireEvent.click(dom.clear);
        expect(dom.input.value).toEqual('');
        expect(mocks.onValueChange).toHaveBeenCalledWith(null);
    });

    it('should reset invalid value onBlur', async () => {
        const { result, dom, mocks } = await setupDatePicker({ value: null, format: DATE_FORMAT_DEFAULT });
        expect(dom.input.value).toEqual('');
        fireEvent.change(dom.input, { target: { value: '2019-10-47' } });
        expect(dom.input.value).toEqual('2019-10-47');
        expect(mocks.onValueChange).not.toHaveBeenCalled();
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('');
        expect(mocks.onValueChange).toHaveBeenCalledWith(null);
    });

    it('should set new value with custom format', async () => {
        const { dom, mocks } = await setupDatePicker({ value: null, format: DATE_FORMAT_CUSTOM });
        expect(dom.input.value).toEqual('');
        fireEvent.change(dom.input, { target: { value: '31-01-2017' } });
        expect(mocks.onValueChange).toHaveBeenCalledWith('2017-01-31');
        expect(dom.input.value).toEqual('31-01-2017');
    });
});
