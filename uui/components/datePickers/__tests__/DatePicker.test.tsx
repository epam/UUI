import * as React from 'react';
import {
    renderSnapshotWithContextAsync, fireEvent, setupComponentForTest, screen,
} from '@epam/test-utils';
import { DatePicker, DatePickerProps } from '../DatePicker';

jest.mock('react-popper', () => {
    const PopperJS = jest.requireActual('react-popper');
    const Popper = function PopperMock({ children }: any) {
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

    const input = screen.queryByRole('textbox') as HTMLInputElement;
    const clear = screen.queryByRole('button');

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
                placeholder="Test"
                disableClear={ false }
                renderFooter={ () => <div>Test footer</div> }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should open picker on field focus', async () => {
        const { dom } = await setupDatePicker({ value: null, format: DATE_FORMAT_DEFAULT });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        fireEvent.focus(dom.input);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close picker on field blur', async () => {
        const { dom } = await setupDatePicker({ value: null, format: DATE_FORMAT_DEFAULT });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        fireEvent.focus(dom.input);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.blur(dom.input);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should change input value after change props', async () => {
        const {
            dom, mocks, setProps,
        } = await setupDatePicker({ value: null, format: DATE_FORMAT_DEFAULT });
        expect(dom.input.value).toEqual('');
        setProps({ value: '2017-01-22' });
        expect(dom.input.value).toEqual('Jan 22, 2017');
        expect(mocks.onValueChange).not.toHaveBeenCalled();
    });

    it('should clear input when clear button is clicked', async () => {
        const { dom, mocks } = await setupDatePicker({ value: '2017-01-22', format: DATE_FORMAT_DEFAULT });
        expect(dom.input.value).toEqual('Jan 22, 2017');
        fireEvent.click(dom.clear);
        expect(dom.input.value).toEqual('');
        expect(mocks.onValueChange).toHaveBeenCalledWith(null);
    });

    it('should reset invalid value onBlur', async () => {
        const { dom, mocks } = await setupDatePicker({ value: null, format: DATE_FORMAT_DEFAULT });
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
