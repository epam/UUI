import React from 'react';
import { RadioInput, RadioInputProps } from '../RadioInput';
import { screen, setupComponentForTest, userEvent } from '@epam/uui-test-utils';

async function setupRadioInput(params: Partial<RadioInputProps>) {
    const { mocks, setProps } = await setupComponentForTest<RadioInputProps>(
        (context) => ({
            value: params.value,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
            ...params,
        }),
        (props) => {
            return <RadioInput { ...props } />;
        },
    );
    return {
        setProps,
        mocks,
    };
}

describe('RadioInput', () => {
    it('should call onValueChange when clicked', async () => {
        const onValueChange = jest.fn();
        await setupRadioInput({ value: false, onValueChange });
        const input = screen.getByRole('radio');
        input.click();
        expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('should call onValueChange on keyboard click', async () => {
        const onValueChange = jest.fn();
        await setupRadioInput({ value: false, onValueChange });
        const input = screen.getByRole('radio');

        await userEvent.type(input, '{space}');

        expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('should call onValueChange on label click', async () => {
        const onValueChange = jest.fn();
        await setupRadioInput({ value: false, onValueChange, label: 'RadioLabel' });
        const label = screen.getByText('RadioLabel');

        label.click();

        expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('should not call onValueChange when clicked if isReadonly is true', async () => {
        const onValueChange = jest.fn();

        await setupRadioInput({ value: false, onValueChange, isReadonly: true });
        const input = screen.getByRole('radio');
        input.click();
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should call getValueChangeAnalyticsEvent when clicked', async () => {
        const onValueChange = jest.fn();
        const getValueChangeAnalyticsEvent = jest.fn();

        await setupRadioInput({ value: false, onValueChange, getValueChangeAnalyticsEvent });
        const input = screen.getByRole('radio');
        input.click();
        expect(getValueChangeAnalyticsEvent).toHaveBeenCalled();
    });

    it('should handle focus event', async () => {
        const onFocus = jest.fn();
        await setupRadioInput({ value: false, onFocus });
        const input = screen.getByRole('radio');
        input.focus();
        expect(onFocus).toHaveBeenCalled();
        expect(input).toHaveFocus();
    });

    it('should handle blur event', async () => {
        const onBlur = jest.fn();
        await setupRadioInput({ value: false, onBlur });
        const input = screen.getByRole('radio');
        input.focus();
        input.blur();
        expect(onBlur).toHaveBeenCalled();
        expect(input).not.toHaveFocus();
    });
});
