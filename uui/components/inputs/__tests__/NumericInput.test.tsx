import React from 'react';
import { NumericInput, NumericInputProps } from '../NumericInput';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, screen, fireEvent,
} from '@epam/uui-test-utils';
import { i18n } from '@epam/uui-core';

async function setupNumericInput(params: Partial<NumericInputProps>) {
    const { result, mocks } = await setupComponentForTest<NumericInputProps>(
        (context) => {
            return {
                value: params.value!,
                min: params.min,
                max: params.max,
                step: params.step,
                isReadonly: params.isReadonly,
                isDisabled: params.isDisabled,
                disableArrows: params.disableArrows,
                disableLocaleFormatting: params.disableLocaleFormatting,
                formatValue: params.formatValue,
                formatOptions: params.formatOptions,
                onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
            };
        },
        (props) => <NumericInput { ...props } />,
    );
    
    const dom = {
        input: screen.getAllByRole('spinbutton')[1] as HTMLInputElement,
    };

    return { result, dom, mocks };
}

describe('NumericInput', () => {
    describe('snapshots', () => {
        it('should be rendered with minimum props', async () => {
            const tree = await renderSnapshotWithContextAsync(<NumericInput value={ null } onValueChange={ jest.fn } min={ 0 } max={ 50 } />);
            expect(tree).toMatchSnapshot();
        });

        it('should be rendered with maximum props', async () => {
            const tree = await renderSnapshotWithContextAsync(<NumericInput value={ null } onValueChange={ jest.fn } min={ 0 } max={ 50 } size="36" mode="inline" />);
            expect(tree).toMatchSnapshot();
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
