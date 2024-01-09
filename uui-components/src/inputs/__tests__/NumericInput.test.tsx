import React from 'react';
import { fireEvent, screen, setupComponentForTest, userEvent } from '@epam/uui-test-utils';
import { i18n } from '@epam/uui-core';

import { NumericInput, NumericInputProps } from '../NumericInput';

async function setupNumericInput(params: Partial<NumericInputProps>) {
    const { mocks, setProps } = await setupComponentForTest<NumericInputProps>(
        (context) => ({
            value: params.value,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
            rawProps: {
                'data-testid': 'uui-numeric-input-wrapper',
            },
            ...params,
        }),
        (props) => {
            return <NumericInput { ...props } />;
        },
    );
    const wrapper = screen.queryByTestId('uui-numeric-input-wrapper') as HTMLDivElement;
    const input = wrapper.children[0] as HTMLInputElement;

    const dom = { input, wrapper };
    return {
        setProps,
        mocks,
        dom,
    };
}

describe('NumericInput', () => {
    describe('value', () => {
        it('should change input value to 55', async () => {
            const { dom } = await setupNumericInput({ value: 0 });

            expect(dom.input).toHaveValue(null);

            await userEvent.click(dom.input);
            expect(dom.input).toHaveValue(0);

            await userEvent.type(dom.input, '55');
            expect(dom.input).toHaveValue(55);
        });

        it('should call onChange when input value changes', async () => {
            const mockOnChange = jest.fn();
            const { dom } = await setupNumericInput({ onValueChange: mockOnChange });

            await userEvent.type(dom.input, '5');

            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenCalledWith(5);
        });

        it('should increase the value when the up arrow key is pressed', async () => {
            const { dom } = await setupNumericInput({ value: 0 });

            expect(dom.input).toHaveValue(null);
            await userEvent.click(dom.input);

            expect(dom.input).toHaveValue(0);
            await userEvent.keyboard('{ArrowUp}');

            expect(dom.input).toHaveValue(1);
        });

        it('should decrease the value when the down arrow key is pressed', async () => {
            const { dom } = await setupNumericInput({ value: 55 });

            expect(dom.input).toHaveValue(null);
            await userEvent.click(dom.input);

            expect(dom.input).toHaveValue(55);
            await userEvent.keyboard('{ArrowDown}');

            expect(dom.input).toHaveValue(54);
        });

        it('should not decrease the value below the minimum limit', async () => {
            const { dom } = await setupNumericInput({ value: 0, min: 0 });

            expect(dom.input).toHaveValue(null);
            await userEvent.click(dom.input);

            expect(dom.input).toHaveValue(0);
            await userEvent.keyboard('{ArrowDown}');

            expect(dom.input).toHaveValue(0);
        });
    });

    describe('placeholder', () => {
        it('should display formatted value when formatValue function is provided', async () => {
            const { dom } = await setupNumericInput({ value: 100, formatValue: (val) =>`$${val}` });

            expect(dom.input.placeholder).toBe('$100');
        });

        it('should display separated value when disableLocaleFormatting is false', async () => {
            const { dom } = await setupNumericInput({ value: 1000, formatOptions: { style: 'currency', currency: 'USD' }, disableLocaleFormatting: false });

            await userEvent.click(dom.input);

            expect(dom.input.placeholder).toBe('$1,000.00');
            expect(dom.input).toHaveValue(1000);
        });

        it('should display unformatted value when disableLocaleFormatting is true', async () => {
            const { dom } = await setupNumericInput({ value: 1000, formatOptions: { style: 'currency', currency: 'USD' }, disableLocaleFormatting: true });

            await userEvent.click(dom.input);
            expect(dom.input.placeholder).not.toBe('$1,000.00');
            expect(dom.input).toHaveValue(1000);
        });
    });

    describe('arrows', () => {
        it('should show arrows when disableArrows, isReadonly, and isDisabled are all false', async () => {
            const { dom } = await setupNumericInput({ disableArrows: false, isReadonly: false, isDisabled: false });

            expect(dom.wrapper).not.toHaveClass('uui-numeric-input-without-arrows');
        });

        it('should not show arrows when disableArrows is true', async () => {
            const { dom } = await setupNumericInput({ disableArrows: true });

            expect(dom.wrapper).toHaveClass('uui-numeric-input-without-arrows');
        });

        it('should not show arrows when isReadonly is true', async () => {
            const { dom } = await setupNumericInput({ isReadonly: true });

            expect(dom.wrapper).toHaveClass('uui-numeric-input-without-arrows');
        });

        it('should not show arrows when isDisabled is true', async () => {
            const { dom } = await setupNumericInput({ isDisabled: true });

            expect(dom.wrapper).toHaveClass('uui-numeric-input-without-arrows');
        });
    });

    describe('handleBlur', () => {
        it('should call onValueChange with validated value when value is different from validated value', async () => {
            const mockOnValueChange = jest.fn();
            const { dom } = await setupNumericInput({ value: 55, onValueChange: mockOnValueChange, max: 5 });

            await userEvent.click(dom.input);
            await userEvent.click(dom.wrapper);

            expect(mockOnValueChange).toHaveBeenCalledWith(5);
        });

        it('should not call onValueChange when value is the same as validated value', async () => {
            const mockOnValueChange = jest.fn();
            const { dom } = await setupNumericInput({ value: 5, onValueChange: mockOnValueChange, max: 5 });

            await userEvent.click(dom.input);
            await userEvent.click(dom.wrapper);

            expect(mockOnValueChange).not.toHaveBeenCalled();
        });

        it('should not call onValueChange when value is null', async () => {
            const mockOnValueChange = jest.fn();
            const { dom } = await setupNumericInput({ value: null, onValueChange: mockOnValueChange, max: 5 });

            await userEvent.click(dom.input);
            await userEvent.click(dom.wrapper);

            expect(mockOnValueChange).not.toHaveBeenCalled();
        });

        it('should call onBlur prop', async () => {
            const mockOnBlur = jest.fn();
            const { dom } = await setupNumericInput({ onBlur: mockOnBlur });

            await userEvent.click(dom.input);
            expect(mockOnBlur).not.toHaveBeenCalled();

            await userEvent.click(dom.wrapper);
            expect(mockOnBlur).toHaveBeenCalled();
        });
    });

    describe('handleChange', () => {
        it('should call onValueChange with null when input value is empty', async () => {
            const mockOnValueChange = jest.fn();
            const { dom } = await setupNumericInput({ value: 0, onValueChange: mockOnValueChange });

            await userEvent.type(dom.input, '{backspace}');

            expect(mockOnValueChange).toHaveBeenCalledWith(null);
        });

        it('should call getValueChangeAnalyticsEvent and send analytics event when props are provided', async () => {
            const mockOnValueChange = jest.fn();
            const mockGetValueChangeAnalyticsEvent = jest.fn().mockReturnValue('analyticsEvent');
            const { dom } = await setupNumericInput({ value: 0, onValueChange: mockOnValueChange, getValueChangeAnalyticsEvent: mockGetValueChangeAnalyticsEvent });

            await userEvent.type(dom.input, '5');

            expect(mockGetValueChangeAnalyticsEvent).toHaveBeenCalledWith(5, 0);
        });
    });

    describe('integer numbers', () => {
        it('should change value by typing', async () => {
            const res = await setupNumericInput({ value: 1000 });
            expect(res.dom.input.placeholder).toEqual('1,000');
            fireEvent.change(res.dom.input, { target: { value: 2000 } });
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(2000);
            expect(res.dom.input.placeholder).toEqual('2,000');
        });

        it('should change value by keyboard arrow up/down', async () => {
            const res = await setupNumericInput({ value: 1000, step: 10 });
            expect(res.dom.input.placeholder).toEqual('1,000');
            fireEvent.keyDown(res.dom.input, { key: 'ArrowUp' });
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(1010);
            expect(res.dom.input.placeholder).toEqual('1,010');
            fireEvent.keyDown(res.dom.input, { key: 'ArrowDown' });
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(1000);
            expect(res.dom.input.placeholder).toEqual('1,000');
        });

        it('should invoke onValueChange on blur only when new value is different from current', async () => {
            const res = await setupNumericInput({ value: 1000 });
            expect(res.dom.input.placeholder).toEqual('1,000');
            fireEvent.focusIn(res.dom.input);
            expect(res.dom.input.value).toEqual('1000');
            fireEvent.focusOut(res.dom.input);
            expect(res.mocks.onValueChange).not.toHaveBeenCalled();
        });

        it('should change value by typing considering min/max specified', async () => {
            const res = await setupNumericInput({ value: 10, min: -15, max: 15 });
            expect(res.dom.input.placeholder).toEqual('10');
            fireEvent.change(res.dom.input, { target: { value: 20 } });
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(20);
            expect(res.dom.input.placeholder).toEqual('20');
            fireEvent.change(res.dom.input, { target: { value: -20 } });
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(-20);
            expect(res.dom.input.placeholder).toEqual('-20');
            fireEvent.change(res.dom.input, { target: { value: -2 } });
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(-2);
            expect(res.dom.input.placeholder).toEqual('-2');
            fireEvent.change(res.dom.input, { target: { value: 2 } });
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(2);
            expect(res.dom.input.placeholder).toEqual('2');
        });

        it('should change value by arrows considering min/max specified', async () => {
            const res = await setupNumericInput({ value: 1, min: -2, max: 2 });
            const [arrowUp, arrowDown] = screen.getAllByRole('button');
            fireEvent.click(arrowUp);
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(2);
            expect(res.dom.input.placeholder).toEqual('2');
            fireEvent.click(arrowUp);
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(2);
            expect(res.dom.input.placeholder).toEqual('2');
            fireEvent.click(arrowDown);
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(1);
            expect(res.dom.input.placeholder).toEqual('1');
            fireEvent.click(arrowDown);
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(0);
            expect(res.dom.input.placeholder).toEqual('0');
            fireEvent.click(arrowDown);
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(-1);
            expect(res.dom.input.placeholder).toEqual('-1');
            fireEvent.click(arrowDown);
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(-2);
            expect(res.dom.input.placeholder).toEqual('-2');
            fireEvent.click(arrowDown);
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(-2);
            expect(res.dom.input.placeholder).toEqual('-2');
        });

        it('should render as readonly if isReadonly=true', async () => {
            const res = await setupNumericInput({ value: 1, isReadonly: true });
            expect(res.dom.input.readOnly).toBeTruthy();
        });

        it('should render as disabled if isDisabled=true', async () => {
            const res = await setupNumericInput({ value: 1, isDisabled: true });
            expect(res.dom.input).toBeDisabled();
        });

        it('should hide arrows when disableArrows=true', async () => {
            await setupNumericInput({ value: 1, disableArrows: true });
            const [arrowUp, arrowDown] = screen.queryAllByRole('button');
            expect(arrowUp).not.toBeDefined();
            expect(arrowDown).not.toBeDefined();
        });

        it('should format value using custom formatValue function', async () => {
            const formatValue = (value: number) => {
                return String(value).split('').join('|');
            };
            const res = await setupNumericInput({ value: 1000, formatValue });
            expect(res.dom.input.placeholder).toEqual('1|0|0|0');
        });

        it('should not format value if disableLocaleFormatting=true', async () => {
            const res = await setupNumericInput({ value: 1000000, disableLocaleFormatting: true });
            expect(res.dom.input.placeholder).toEqual('1000000');
        });

        it('should display un-formatted value when focused', async () => {
            const res = await setupNumericInput({ value: 1000000 });
            expect(res.dom.input.placeholder).toEqual('1,000,000');
            expect(res.dom.input).toHaveValue(null);
            fireEvent.focusIn(res.dom.input);
            expect(res.dom.input).toHaveValue(1000000);
        });
    });

    describe('fractional numbers', () => {
        it('should format value using custom formatValue function', async () => {
            const formatValue = jest.fn().mockImplementation((value) => String(value).split('').join('|'));
            const res = await setupNumericInput({
                value: 1000.111,
                formatOptions: { maximumFractionDigits: 3 },
                formatValue,
            });
            expect(res.dom.input.placeholder).toEqual('1|0|0|0|.|1|1|1');
            fireEvent.change(res.dom.input, { target: { value: 1000.2222222222 } });
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(1000.222);
            expect(res.dom.input.placeholder).toEqual('1|0|0|0|.|2|2|2');
        });

        it('should change value by arrows considering min/max specified and fractional step', async () => {
            const res = await setupNumericInput({
                value: 1199.09,
                formatOptions: { maximumFractionDigits: 3, minimumFractionDigits: 2 },
                step: 0.001,
            });
            expect(res.dom.input.placeholder).toEqual('1,199.09');
            const [arrowUp, arrowDown] = screen.getAllByRole('button');
            fireEvent.click(arrowUp);
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(1199.091);
            expect(res.dom.input.placeholder).toEqual('1,199.091');
            fireEvent.click(arrowDown);
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(1199.09);
            expect(res.dom.input.placeholder).toEqual('1,199.09');
        });

        it('should change value by typing considering min/max specified', async () => {
            const res = await setupNumericInput({
                value: 1000.11,
                formatOptions: { maximumFractionDigits: 3, minimumFractionDigits: 2 },
            });
            expect(res.dom.input.placeholder).toEqual('1,000.11');
            fireEvent.change(res.dom.input, { target: { value: 1000.1116 } });
            expect(res.mocks.onValueChange).toHaveBeenCalledWith(1000.112);
            expect(res.dom.input.placeholder).toEqual('1,000.112');
        });

        it('should display value using "de-DE" locale', async () => {
            i18n.locale = 'de-DE';
            const res = await setupNumericInput({
                value: 1000.112,
                formatOptions: { maximumFractionDigits: 3 },
            });
            expect(res.dom.input.placeholder).toEqual('1.000,112');
        });
    });
});
