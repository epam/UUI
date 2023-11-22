import React from 'react';
import { screen, setupComponentForTest, userEvent } from '@epam/uui-test-utils';

import { NumericInput, NumericInputProps } from '../NumericInput';

async function setupTestComponent(params: Partial<NumericInputProps>) {
    const { mocks, setProps } = await setupComponentForTest<NumericInputProps>(
        (context) => ({
            value: params.value,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
            ...params,
        }),
        (props) => {
            return <NumericInput { ...props } />;
        },
    );
    const input = screen.queryByTestId('uui-numeric-input') as HTMLInputElement;
    const wrapper = screen.queryByTestId('uui-numeric-input-wrapper') as HTMLDivElement;

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
            const { dom } = await setupTestComponent({ value: 0 });

            expect(dom.input).toHaveValue(null);

            await userEvent.click(dom.input);
            expect(dom.input).toHaveValue(0);

            await userEvent.type(dom.input, '55');
            expect(dom.input).toHaveValue(55);
        });

        it('should call onChange when input value changes', async () => {
            const mockOnChange = jest.fn();
            const { dom } = await setupTestComponent({ onValueChange: mockOnChange });

            await userEvent.type(dom.input, '5');

            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenCalledWith(5);
        });

        it('should increase the value when the up arrow key is pressed', async () => {
            const { dom } = await setupTestComponent({ value: 0 });

            expect(dom.input).toHaveValue(null);
            await userEvent.click(dom.input);

            expect(dom.input).toHaveValue(0);
            await userEvent.keyboard('{ArrowUp}');

            expect(dom.input).toHaveValue(1);
        });

        it('should decrease the value when the down arrow key is pressed', async () => {
            const { dom } = await setupTestComponent({ value: 55 });

            expect(dom.input).toHaveValue(null);
            await userEvent.click(dom.input);

            expect(dom.input).toHaveValue(55);
            await userEvent.keyboard('{ArrowDown}');

            expect(dom.input).toHaveValue(54);
        });

        it('should not decrease the value below the minimum limit', async () => {
            const { dom } = await setupTestComponent({ value: 0, min: 0 });

            expect(dom.input).toHaveValue(null);
            await userEvent.click(dom.input);

            expect(dom.input).toHaveValue(0);
            await userEvent.keyboard('{ArrowDown}');

            expect(dom.input).toHaveValue(0);
        });
    });

    describe('placeholder', () => {
        it('should display formatted value when formatValue function is provided', async () => {
            const { dom } = await setupTestComponent({ value: 100, formatValue: (val) =>`$${val}` });

            expect(dom.input.placeholder).toBe('$100');
        });

        it('should display separated value when disableLocaleFormatting is false', async () => {
            const { dom } = await setupTestComponent({ value: 1000, formatOptions: { style: 'currency', currency: 'USD' }, disableLocaleFormatting: false });

            await userEvent.click(dom.input);

            expect(dom.input.placeholder).toBe('$1,000.00');
            expect(dom.input).toHaveValue(1000);
        });

        it('should display unformatted value when disableLocaleFormatting is true', async () => {
            const { dom } = await setupTestComponent({ value: 1000, formatOptions: { style: 'currency', currency: 'USD' }, disableLocaleFormatting: true });

            await userEvent.click(dom.input);
            expect(dom.input.placeholder).not.toBe('$1,000.00');
            expect(dom.input).toHaveValue(1000);
        });
    });

    describe('arrows', () => {
        it('should show arrows when disableArrows, isReadonly, and isDisabled are all false', async () => {
            const { dom } = await setupTestComponent({ disableArrows: false, isReadonly: false, isDisabled: false });

            expect(dom.wrapper).not.toHaveClass('uui-numeric-input-without-arrows');
        });

        it('should not show arrows when disableArrows is true', async () => {
            const { dom } = await setupTestComponent({ disableArrows: true });

            expect(dom.wrapper).toHaveClass('uui-numeric-input-without-arrows');
        });

        it('should not show arrows when isReadonly is true', async () => {
            const { dom } = await setupTestComponent({ isReadonly: true });

            expect(dom.wrapper).toHaveClass('uui-numeric-input-without-arrows');
        });

        it('should not show arrows when isDisabled is true', async () => {
            const { dom } = await setupTestComponent({ isDisabled: true });

            expect(dom.wrapper).toHaveClass('uui-numeric-input-without-arrows');
        });
    });

    describe('handleBlur', () => {
        it('should call onValueChange with validated value when value is different from validated value', async () => {
            const mockOnValueChange = jest.fn();
            const { dom } = await setupTestComponent({ value: 55, onValueChange: mockOnValueChange, max: 5 });

            await userEvent.click(dom.input);
            await userEvent.click(dom.wrapper);

            expect(mockOnValueChange).toHaveBeenCalledWith(5);
        });

        it('should not call onValueChange when value is the same as validated value', async () => {
            const mockOnValueChange = jest.fn();
            const { dom } = await setupTestComponent({ value: 5, onValueChange: mockOnValueChange, max: 5 });

            await userEvent.click(dom.input);
            await userEvent.click(dom.wrapper);

            expect(mockOnValueChange).not.toHaveBeenCalled();
        });

        it('should call onBlur prop', async () => {
            const mockOnBlur = jest.fn();
            const { dom } = await setupTestComponent({ onBlur: mockOnBlur });

            await userEvent.click(dom.input);
            expect(mockOnBlur).not.toHaveBeenCalled();

            await userEvent.click(dom.wrapper);
            expect(mockOnBlur).toHaveBeenCalled();
        });
    });

    describe('handleChange', () => {
        it('should call onValueChange with null when input value is empty', async () => {
            const mockOnValueChange = jest.fn();
            const { dom } = await setupTestComponent({ value: 0, onValueChange: mockOnValueChange });

            await userEvent.type(dom.input, '{backspace}');

            expect(mockOnValueChange).toHaveBeenCalledWith(null);
        });

        it('should call getValueChangeAnalyticsEvent and send analytics event when props are provided', async () => {
            const mockOnValueChange = jest.fn();
            const mockGetValueChangeAnalyticsEvent = jest.fn().mockReturnValue('analyticsEvent');
            const { dom } = await setupTestComponent({ value: 0, onValueChange: mockOnValueChange, getValueChangeAnalyticsEvent: mockGetValueChangeAnalyticsEvent });

            await userEvent.type(dom.input, '5');

            expect(mockGetValueChangeAnalyticsEvent).toHaveBeenCalledWith(5, 0);
        });
    });
});
